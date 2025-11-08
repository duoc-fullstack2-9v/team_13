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
        // Si el producto ya existe, incrementar cantidad
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo
        newItems = [...state.items, action.payload];
      }
      
      // Guardar en localStorage
      saveCartToStorage(newItems);
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.cantidad, 0),
        totalPrice: newItems.reduce((total, item) => 
          total + (item.producto.precio * item.cantidad), 0
        )
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

  // Funciones del carrito
  const addToCart = (product, quantity = 1) => {
    if (!user) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Debes iniciar sesión para agregar productos al carrito' 
      });
      return;
    }

    const cartItem = {
      producto: product,
      cantidad: quantity,
      precioUnitario: product.precio,
      subtotal: product.precio * quantity
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });
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

  // Crear pedido en el backend
  const createOrder = async (descuento = 0) => {
    if (!user || state.items.length === 0) {
      throw new Error('No hay items en el carrito o usuario no autenticado');
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const orderData = {
        clienteEmail: user.email,
        items: state.items.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad
        })),
        descuento: descuento,
        total: state.totalPrice - descuento,
        estado: 'PENDIENTE',
        notas: ''
      };

      const createdOrder = await apiService.createOrder(orderData);
      
      dispatch({ type: 'SET_CURRENT_ORDER', payload: createdOrder.id });
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return createdOrder;
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Error al crear el pedido: ' + error.message 
      });
      throw error;
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
    getTotalWithDiscount
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