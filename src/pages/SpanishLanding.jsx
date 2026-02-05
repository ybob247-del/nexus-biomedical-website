/**
 * Spanish Landing Page (Página de Inicio en Español)
 * Dedicated landing page optimized for Hispanic market
 * Features culturally relevant messaging and testimonials
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackSpanishEngagement, trackConversion } from '../utils/analytics';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SpanishLanding = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Ensure Spanish language is active
    if (i18n.language !== 'es') {
      i18n.changeLanguage('es');
    }

    // Track Spanish landing page visit
    trackSpanishEngagement('landing_page_visit', {
      source: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
    });
  }, [i18n]);

  const handleCTAClick = (action) => {
    trackSpanishEngagement('cta_click', { action });
    
    if (action === 'start_assessment') {
      navigate('/endoguard');
    } else if (action === 'signup') {
      navigate('/signup');
    } else if (action === 'contact') {
      navigate('/contact');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white'
    }}>
      <Header />
      
      {/* Hero Section - Hispanic Market Focus */}
      <section style={{ 
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'inline-block',
          padding: '0.5rem 1.5rem',
          borderRadius: '2rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
        }}>
          ✨ Evaluación GRATUITA - Sin Tarjeta de Crédito
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2
        }}>
          Inteligencia de Salud Personalizada para la Comunidad Hispana
        </h1>

        <p style={{
          fontSize: '1.25rem',
          lineHeight: 1.8,
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '800px',
          margin: '0 auto 3rem',
          fontWeight: 300
        }}>
          Plataformas avanzadas de apoyo clínico que combinan inteligencia artificial de vanguardia 
          con medicina basada en evidencia para transformar su atención médica y resultados clínicos.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          <button
            onClick={() => handleCTAClick('start_assessment')}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
              border: 'none',
              borderRadius: '0.75rem',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(236, 72, 153, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(236, 72, 153, 0.4)';
            }}
          >
            🩺 Comenzar Evaluación Gratuita
          </button>

          <button
            onClick={() => handleCTAClick('contact')}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.75rem',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            📞 Hablar con un Asesor
          </button>
        </div>

        {/* Trust Indicators */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
            <span>Cumple con HIPAA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
            <span>Datos Encriptados</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
            <span>Basado en Evidencia</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✓</span>
            <span>Disponible en Español</span>
          </div>
        </div>
      </section>

      {/* Why Nexus for Hispanic Community */}
      <section style={{
        padding: '4rem 2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #60a5fa 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Por Qué Nexus para la Comunidad Hispana
          </h2>
          
          <p style={{
            textAlign: 'center',
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            lineHeight: 1.8
          }}>
            Entendemos los desafíos únicos de salud que enfrenta la comunidad hispana. 
            Nuestras plataformas están diseñadas para abordar condiciones prevalentes y barreras de acceso.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {[
              {
                icon: '🩺',
                title: 'EndoGuard™',
                description: 'Evaluación de riesgo de endometriosis - una condición que afecta desproporcionadamente a mujeres hispanas',
                highlight: 'Detección temprana puede reducir años de diagnóstico'
              },
              {
                icon: '💊',
                title: 'RxGuard™',
                description: 'Verificador de interacciones medicamentosas - crucial para pacientes con múltiples condiciones crónicas',
                highlight: 'Previene reacciones adversas y hospitalizaciones'
              },
              {
                icon: '👴',
                title: 'ElderWatch™',
                description: 'Monitoreo de salud para adultos mayores - apoyando el cuidado familiar tradicional',
                highlight: 'Mantiene a la familia informada y conectada'
              }
            ].map((platform, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{platform.icon}</div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  color: '#60a5fa'
                }}>
                  {platform.title}
                </h3>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}>
                  {platform.description}
                </p>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#10b981',
                  fontWeight: 500
                }}>
                  ✓ {platform.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hispanic Community Testimonials */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #60a5fa 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Lo Que Dicen Nuestros Usuarios
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          {[
            {
              name: 'María González',
              location: 'Los Angeles, CA',
              platform: 'EndoGuard',
              quote: 'EndoGuard me ayudó a recopilar información sobre mis síntomas para compartir con mi doctora. Fue útil para nuestra conversación.',
              rating: 5
            },
            {
              name: 'Carlos Ramírez',
              location: 'Miami, FL',
              platform: 'RxGuard',
              quote: 'RxGuard identificó una posible interacción medicamentosa que compartimos con la farmacia de mi mamá. Fue útil para asegurar su seguridad.',
              rating: 5
            },
            {
              name: 'Ana Martínez',
              location: 'Houston, TX',
              platform: 'ElderWatch',
              quote: 'Como cuidadora de mi padre, ElderWatch me da tranquilidad. Puedo monitorear su salud y recibir alertas importantes, todo en español.',
              rating: 5
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '3rem',
                color: 'rgba(96, 165, 250, 0.3)',
                position: 'absolute',
                top: '1rem',
                left: '1.5rem',
                lineHeight: 1
              }}>
                "
              </div>
              
              <div style={{ marginTop: '2rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '0.25rem',
                  marginBottom: '1rem'
                }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#fbbf24', fontSize: '1.25rem' }}>★</span>
                  ))}
                </div>

                <p style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic'
                }}>
                  {testimonial.quote}
                </p>

                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1rem'
                }}>
                  <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: '0.25rem' }}>
                    {testimonial.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {testimonial.location} • Usuario de {testimonial.platform}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Health Statistics for Hispanic Community */}
      <section style={{
        padding: '4rem 2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #60a5fa 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Por Qué Es Importante
          </h2>

          <p style={{
            textAlign: 'center',
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            lineHeight: 1.8
          }}>
            La comunidad hispana enfrenta disparidades significativas en el acceso y resultados de salud.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {[
              {
                stat: '2.5x',
                description: 'Mayor riesgo de diabetes tipo 2 en hispanos vs. población general'
              },
              {
                stat: '1.5x',
                description: 'Mayor probabilidad de diagnóstico tardío de cáncer'
              },
              {
                stat: '30%',
                description: 'De hispanos sin seguro médico o con cobertura insuficiente'
              },
              {
                stat: '7-10 años',
                description: 'Tiempo promedio para diagnosticar endometriosis en mujeres hispanas'
              }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '1rem'
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#ef4444',
                  marginBottom: '1rem'
                }}>
                  {item.stat}
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#10b981',
              marginBottom: '1rem'
            }}>
              Nexus Está Aquí Para Cambiar Esto
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.8,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Proporcionamos herramientas de salud avanzadas, accesibles y culturalmente relevantes 
              para empoderar a la comunidad hispana a tomar control de su salud.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #60a5fa 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Comience Su Viaje de Salud Hoy
        </h2>

        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
          lineHeight: 1.8
        }}>
          Evaluación gratuita en 5 minutos. Sin tarjeta de crédito. Resultados inmediatos.
        </p>

        <button
          onClick={() => handleCTAClick('start_assessment')}
          style={{
            padding: '1.25rem 3rem',
            fontSize: '1.25rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)',
            marginBottom: '1.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(236, 72, 153, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(236, 72, 153, 0.4)';
          }}
        >
          🩺 Comenzar Evaluación Gratuita Ahora
        </button>

        <div style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          Únase a miles de usuarios hispanos que ya confían en Nexus para su salud
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpanishLanding;
