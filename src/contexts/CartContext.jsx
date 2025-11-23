import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const CartContext = createContext();

// Funciones para localStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

const clearCartFromStorage = () => {
  try {
    localStorage.removeItem('cartItems');
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

// Estado inicial del carrito
const getInitialState = () => {
  const savedItems = loadCartFromStorage();
  const totalItems = savedItems.reduce((total, item) => total + item.cantidad, 0);
  const totalPrice = savedItems.reduce((total, item) => 
    total + (item.producto.precio * item.cantidad), 0
  );
  
  return {
    items: savedItems,
    totalItems,
    totalPrice,
    isLoading: false,
    error: null,
    currentOrderId: null
  };
};

const initialState = getInitialState();

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.producto.id === action.payload.producto.id
      );
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, verificar stock antes de incrementar
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.cantidad + action.payload.cantidad;
        const availableStock = action.payload.producto.stock || 0;
        
        if (availableStock > 0 && newQuantity <= availableStock) {
          newItems = state.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, cantidad: newQuantity }
              : item
          );
        } else {
          // No se puede agregar más, retornar estado actual con error
          return {
            ...state,
            error: `Stock insuficiente. Solo quedan ${availableStock} unidades disponibles.`
          };
        }
      } else {
        // Si es un producto nuevo, verificar stock
        const availableStock = action.payload.producto.stock || 0;
        
        if (availableStock > 0 && action.payload.cantidad <= availableStock) {
          newItems = [...state.items, action.payload];
        } else {
          return {
            ...state,
            error: availableStock === 0 
              ? 'Este producto está agotado.' 
              : `Stock insuficiente. Solo quedan ${availableStock} unidades disponibles.`
          };
        }
      }
      
      // Guardar en localStorage
      saveCartToStorage(newItems);
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.cantidad, 0),
        totalPrice: newItems.reduce((total, item) => 
          total + (item.producto.precio * item.cantidad), 0
        ),
        error: null // Limpiar error en caso de éxito
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(
        item => item.producto.id !== action.payload
      );
      
      // Guardar en localStorage
      saveCartToStorage(filteredItems);
      
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((total, item) => total + item.cantidad, 0),
        totalPrice: filteredItems.reduce((total, item) => 
          total + (item.producto.precio * item.cantidad), 0
        )
      };
    
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.producto.id === action.payload.productId
          ? { ...item, cantidad: action.payload.quantity }
          : item
      ).filter(item => item.cantidad > 0);
      
      // Guardar en localStorage
      saveCartToStorage(updatedItems);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.cantidad, 0),
        totalPrice: updatedItems.reduce((total, item) => 
          total + (item.producto.precio * item.cantidad), 0
        )
      };
    
    case 'CLEAR_CART':
      // Limpiar localStorage
      clearCartFromStorage();
      
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        currentOrderId: null
      };
    
    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrderId: action.payload
      };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Limpiar carrito al cambiar de usuario
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  // Guardar email del usuario para validar persistencia
  useEffect(() => {
    if (user && state.items.length > 0) {
      const savedUserEmail = localStorage.getItem('cartUserEmail');
      if (savedUserEmail && savedUserEmail !== user.email) {
        // Si el usuario cambió, limpiar carrito
        dispatch({ type: 'CLEAR_CART' });
      }
      localStorage.setItem('cartUserEmail', user.email);
    }
  }, [user, state.items.length]);

  // Verificar stock de un producto
  const checkProductStock = async (productId) => {
    try {
      return await apiService.getProductStock(productId);
    } catch (error) {
      console.error('Error verificando stock:', error);
      return 0;
    }
  };

  // Funciones del carrito (funciona para usuarios logueados y no logueados)
  const addToCart = async (product, quantity = 1) => {
    try {
      // Verificar stock actual del producto
      const currentStock = await checkProductStock(product.id);
      
      if (currentStock === 0) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: `El producto "${product.nombre}" está agotado.` 
        });
        return false;
      }

      // Verificar si ya existe en el carrito
      const existingItem = state.items.find(item => item.producto.id === product.id);
      const totalQuantityRequested = (existingItem?.cantidad || 0) + quantity;

      if (totalQuantityRequested > currentStock) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: `Stock insuficiente para "${product.nombre}". Solo quedan ${currentStock} unidades disponibles.` 
        });
        return false;
      }

      const cartItem = {
        producto: { ...product, stock: currentStock },
        cantidad: quantity,
        precioUnitario: product.precio,
        subtotal: product.precio * quantity
      };

      dispatch({ type: 'ADD_ITEM', payload: cartItem });
      return true;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Error al agregar producto al carrito.' 
      });
      return false;
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { productId, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const ensureUserExistsInApi = async (payload) => {
    if (!payload?.email) return;
    const splitFullName = (fullName = '', fallbackFirst = 'Usuario', fallbackLast = 'Invitado') => {
      const parts = fullName.trim().split(/\s+/).filter(Boolean);
      if (parts.length === 0) {
        return { first: fallbackFirst, last: fallbackLast };
      }
      const first = parts[0];
      const last = parts.slice(1).join(' ') || fallbackLast;
      return { first, last };
    };
    
    const baseFullName = `${payload.nombre || ''} ${payload.apellido || ''}`.trim() || payload.displayName || '';
    const { first, last } = splitFullName(
      baseFullName,
      payload.nombre?.trim() || 'Usuario',
      payload.apellido?.trim() || 'Invitado'
    );
    
    const sanitizedPayload = {
      email: payload.email,
      nombre: payload.nombre?.trim() || first,
      apellido: payload.apellido?.trim() || last,
      telefono: payload.telefono?.trim() || '000000000',
      userType: payload.userType || 'customer',
      password: payload.password || 'guest123',
      edad: Number.isFinite(Number(payload.edad)) && Number(payload.edad) > 0
        ? Number(payload.edad)
        : 25,
      esEstudianteDuoc: typeof payload.esEstudianteDuoc === 'boolean'
        ? payload.esEstudianteDuoc
        : false
    };
    try {
      const apiUser = await apiService.getUserByEmail(payload.email);
      if (apiUser) {
        return;
      }
    } catch (getError) {
      if (getError.status && getError.status !== 404) {
        console.warn('⚠️ Error consultando usuario en API:', getError);
        return;
      }
    }

    let creationStatus = null;
    try {
      await apiService.createUser(sanitizedPayload);
    } catch (createError) {
      creationStatus = createError.status || null;
      if (!createError.status || createError.status !== 409) {
        console.warn('⚠️ Error al registrar usuario en API:', createError);
      }
    }
    
    if (creationStatus === null || creationStatus === 409) {
      try {
        await apiService.getUserByEmail(sanitizedPayload.email);
      } catch (verifyError) {
        console.warn('⚠️ Error verificando usuario tras registro:', verifyError);
      }
    }
  };

  // Crear pedido en el backend
  const createOrder = async (_discount = 0, guestInfo = null, extraData = {}) => {
    if (state.items.length === 0) {
      throw new Error('No hay items en el carrito');
    }

    // Validar si el usuario está logueado o si se proporcionó información de invitado
    if (!user && !guestInfo) {
      throw new Error('Debes iniciar sesión o proporcionar tus datos para realizar el pedido');
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Verificar stock de todos los productos antes de crear el pedido
      for (const item of state.items) {
        const currentStock = await checkProductStock(item.producto.id);
        if (currentStock < item.cantidad) {
          throw new Error(`Stock insuficiente para "${item.producto.nombre}". Solo quedan ${currentStock} unidades.`);
        }
      }

      const normalizeEmail = (email) => (email || '').trim().toLowerCase();
      const guestDetails = guestInfo ? {
        ...guestInfo,
        email: normalizeEmail(guestInfo.email)
      } : null;
      let userEmail = user ? normalizeEmail(user.email) : guestDetails?.email || null;

      // Si hay un usuario logueado, asegurar que existe en la API
      if (user && user.email) {
        const normalizedUserEmail = normalizeEmail(user.email);
        const nameParts = user.displayName?.split(' ') || [];
        await ensureUserExistsInApi({
          email: normalizedUserEmail,
          nombre: user.nombre || nameParts[0] || 'Usuario',
          apellido: user.apellido || nameParts.slice(1).join(' ') || '',
          password: 'firebase_auth_user',
          telefono: user.telefono || '',
          userType: user.userType || 'customer'
        });
      }

      // Si es usuario invitado, asegurar que el usuario exista en la API
      if (!user && guestDetails) {
        await ensureUserExistsInApi({
          email: guestDetails.email,
          nombre: guestDetails.nombre,
          apellido: guestDetails.apellido || '',
          password: 'guest123',
          telefono: guestDetails.telefono || '',
          userType: 'customer'
        });
      }

      // Validación final: asegurar que tenemos un email válido
      if (!userEmail) {
        throw new Error('No se pudo determinar el usuario para el pedido. Por favor, inicia sesión o proporciona tus datos.');
      }

      const normalizeIsoDate = (rawDate) => {
        const fallbackDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const parsed = rawDate ? new Date(rawDate) : fallbackDate;
        const validDate = isNaN(parsed.getTime()) ? fallbackDate : parsed;
        // API espera formato ISO_LOCAL_DATE_TIME (YYYY-MM-DDTHH:mm:ss)
        return validDate.toISOString().split('.')[0];
      };

      const orderData = {
        emailUsuario: userEmail,
        usuarioEmail: userEmail, // compatibilidad con APIs previas
        fechaEntrega: normalizeIsoDate(extraData.fechaEntrega),
        observaciones: typeof extraData.observaciones === 'string'
          ? extraData.observaciones.trim()
          : '',
        items: state.items.map(item => ({
          productId: item.producto.id,
          cantidad: item.cantidad,
          mensajePersonalizado: item.mensaje || ''
        })),
        productos: state.items.map(item => ({
          productId: item.producto.id,
          cantidad: item.cantidad,
          mensaje: item.mensaje || ''
        }))
      };

      const normalizeOrderResponse = (orderResponse) => {
        return orderResponse?.pedido || orderResponse;
      };

      const createOrRetryOrder = async () => {
        try {
          return normalizeOrderResponse(await apiService.createOrder(orderData));
        } catch (orderError) {
          const errorMessage = (orderError?.data?.message || orderError.message || '').toLowerCase();
          const shouldRetry = errorMessage.includes('usuario') && errorMessage.includes('no encontrado');
          
          if (!shouldRetry) {
            throw orderError;
          }

          // Intentar registrar nuevamente y reintentar pedido
          const userDisplayParts = user?.displayName ? user.displayName.split(' ') : [];
          const fallbackUserData = {
            email: userEmail,
            nombre: guestDetails?.nombre || user?.nombre || userDisplayParts[0] || 'Usuario',
            apellido: guestDetails?.apellido || user?.apellido || userDisplayParts.slice(1).join(' ') || '',
            password: user ? 'firebase_auth_user' : 'guest123',
            telefono: guestDetails?.telefono || user?.telefono || '',
            userType: user?.userType || 'customer'
          };

          await ensureUserExistsInApi(fallbackUserData);
          return normalizeOrderResponse(await apiService.createOrder(orderData));
        }
      };

      const createdOrder = await createOrRetryOrder();
      
      dispatch({ type: 'SET_CURRENT_ORDER', payload: createdOrder?.id });
      dispatch({ type: 'CLEAR_CART' });
      
      return createdOrder;
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Error al crear el pedido: ' + error.message 
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Obtener el total con descuento
  const getTotalWithDiscount = (discount = 0) => {
    return Math.max(0, state.totalPrice - discount);
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearError,
    createOrder,
    getTotalWithDiscount,
    checkProductStock
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;
