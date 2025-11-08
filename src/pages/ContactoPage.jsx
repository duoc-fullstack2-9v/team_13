import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ContactoPage.css";

const ContactoPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío del formulario
    console.log('Formulario enviado:', formData);
    setEnviado(true);
    
    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setEnviado(false);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
    }, 3000);
  };

  return (
    <div className="contacto-page">
      <Header />
      
      <main className="contacto-main">
        <section className="contacto-hero">
          <div className="container">
            <h1>Contáctanos</h1>
            <p>Estamos aquí para hacer realidad tus ideas dulces</p>
          </div>
        </section>

        <section className="contacto-content">
          <div className="container">
            <div className="contacto-grid">
              
              {/* Información de contacto */}
              <div className="contacto-info">
                <h2>Información de Contacto</h2>
                
                <div className="info-item">
                  <div className="info-icon">📍</div>
                  <div className="info-text">
                    <h3>Dirección</h3>
                    <p>Av. Providencia 1234<br />Santiago, Chile</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📞</div>
                  <div className="info-text">
                    <h3>Teléfono</h3>
                    <p>+56 2 2234 5678</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-text">
                    <h3>Email</h3>
                    <p>contacto@pasteleriamilsabores.cl</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">🕒</div>
                  <div className="info-text">
                    <h3>Horarios de Atención</h3>
                    <p>
                      Lunes a Viernes: 8:00 - 20:00<br />
                      Sábados: 8:00 - 18:00<br />
                      Domingos: 9:00 - 15:00
                    </p>
                  </div>
                </div>

                <div className="redes-sociales">
                  <h3>Síguenos</h3>
                  <div className="redes-links">
                    <a href="#" className="red-social facebook">📘 Facebook</a>
                    <a href="#" className="red-social instagram">📸 Instagram</a>
                    <a href="#" className="red-social whatsapp">💬 WhatsApp</a>
                  </div>
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="contacto-form">
                <h2>Envíanos un Mensaje</h2>
                
                {enviado ? (
                  <div className="mensaje-enviado">
                    <div className="check-icon">✅</div>
                    <h3>¡Mensaje Enviado!</h3>
                    <p>Gracias por contactarnos. Te responderemos pronto.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="nombre">Nombre Completo *</label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="asunto">Asunto *</label>
                        <select
                          id="asunto"
                          name="asunto"
                          value={formData.asunto}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="pedido">Realizar Pedido</option>
                          <option value="consulta">Consulta General</option>
                          <option value="torta-personalizada">Torta Personalizada</option>
                          <option value="evento">Evento Especial</option>
                          <option value="reclamo">Reclamo</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="mensaje">Mensaje *</label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        rows="6"
                        placeholder="Cuéntanos en qué podemos ayudarte..."
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-enviar">
                      Enviar Mensaje
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mapa-section">
          <div className="container">
            <h2>Nuestra Ubicación</h2>
            <div className="mapa-placeholder">
              <div className="mapa-info">
                <span>🗺️</span>
                <p>Nos encontramos en el corazón de Santiago</p>
                <p>Fácil acceso en transporte público y estacionamiento disponible</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactoPage;