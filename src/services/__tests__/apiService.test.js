import apiService from '../apiService';

describe('apiService request wrapper', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  test('performs successful requests and parses JSON', async () => {
    const mockResponse = { ok: true, status: 200, text: () => Promise.resolve('{"data":123}') };
    fetch.mockResolvedValueOnce(mockResponse);

    const result = await apiService.request('/test');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.any(Object));
    expect(result).toEqual({ data: 123 });
  });

  test('throws descriptive errors for failed requests', async () => {
    const mockResponse = { ok: false, status: 404, text: () => Promise.resolve('{"message":"Not found"}') };
    fetch.mockResolvedValueOnce(mockResponse);

    await expect(apiService.request('/missing')).rejects.toThrow('Not found');
  });
});

describe('apiService helpers', () => {
  test('getOrdersByUser tries alternate endpoints when needed', async () => {
    const spy = vi.spyOn(apiService, 'request');
    spy.mockImplementation((endpoint) => {
      if (endpoint.includes('/usuario/')) {
        return Promise.resolve({ pedidos: [] });
      }
      if (endpoint.includes('/cliente/')) {
        return Promise.resolve({ pedidos: [{ id: 1, numeroPedido: 'A1' }] });
      }
      return Promise.resolve([]);
    });

    const result = await apiService.getOrdersByUser('User@Example.Com');
    expect(result).toHaveLength(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('getOrderTracking normalizes pedido payload', async () => {
    const spy = vi.spyOn(apiService, 'request').mockResolvedValue({ pedido: { id: 5 } });
    const data = await apiService.getOrderTracking('A-55');
    expect(data).toEqual({ id: 5 });
    expect(spy).toHaveBeenCalledWith('/api/pedidos/A-55/seguimiento');
  });

  test('createOrder posts payload without altering data', async () => {
    const payload = { items: [{ productId: 1, cantidad: 2 }] };
    const spy = vi.spyOn(apiService, 'request').mockResolvedValue({ pedido: { id: 99 } });
    const data = await apiService.createOrder(payload);
    expect(spy).toHaveBeenCalledWith('/api/pedidos', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(payload)
    }));
    expect(data).toEqual({ pedido: { id: 99 } });
  });

  test('product endpoints delegate to request with correct configs', async () => {
    const spy = vi.spyOn(apiService, 'request').mockResolvedValue({ ok: true });

    await apiService.getProducts();
    await apiService.getProduct('10');
    await apiService.createProduct({ nombre: 'Tres Leches' });
    await apiService.updateProduct('10', { nombre: 'Selva Negra' });
    await apiService.deleteProduct('11');
    await apiService.toggleProductStatus('12', true);
    await apiService.getStock();
    spy.mockResolvedValueOnce({ stock: 7 });
    const stock = await apiService.getProductStock('10');
    await apiService.updateStock('10', 5);
    await apiService.getCategories();

    expect(spy).toHaveBeenNthCalledWith(1, '/api/productos');
    expect(spy).toHaveBeenNthCalledWith(2, '/api/productos/10');
    expect(spy).toHaveBeenNthCalledWith(3, '/api/productos', expect.objectContaining({ method: 'POST' }));
    expect(spy).toHaveBeenNthCalledWith(4, '/api/productos/10', expect.objectContaining({ method: 'PUT' }));
    expect(spy).toHaveBeenNthCalledWith(5, '/api/productos/11', expect.objectContaining({ method: 'DELETE' }));
    expect(spy).toHaveBeenNthCalledWith(6, '/api/productos/12/estado', expect.objectContaining({ method: 'PUT' }));
    expect(spy).toHaveBeenNthCalledWith(7, '/api/productos/stock');
    expect(stock).toBe(7);
    expect(spy).toHaveBeenNthCalledWith(8, '/api/productos/10/stock');
    expect(spy).toHaveBeenNthCalledWith(9, '/api/productos/10/stock', expect.objectContaining({ method: 'PUT' }));
    expect(spy).toHaveBeenNthCalledWith(10, '/api/productos/categories');
  });

  test('sales and orders helpers normalize API payloads', async () => {
    const spy = vi.spyOn(apiService, 'request');
    spy.mockResolvedValueOnce({ ventas: [{ id: 1 }] });
    const sales = await apiService.getSales();
    expect(sales).toHaveLength(1);

    spy.mockResolvedValueOnce({ venta: { id: 5 } });
    const sale = await apiService.createSale({ total: 1000 });
    expect(sale).toEqual({ id: 5 });

    spy.mockResolvedValueOnce({ pedidos: [{ id: 1 }] });
    const orders = await apiService.getOrders();
    expect(orders).toHaveLength(1);

    spy.mockResolvedValueOnce({ pedido: { id: 7 } });
    const order = await apiService.getOrder(7);
    expect(order).toEqual({ id: 7 });
  });
});
