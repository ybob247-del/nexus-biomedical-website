/**
 * EndoGuard Spanish Landing Page
 * Dedicated landing page for EndoGuard platform in Spanish
 * Optimized for Hispanic market with culturally relevant messaging
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/spanish-landing.css';

const EndoGuardSpanishLanding = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Ensure Spanish language is active
    if (i18n.language !== 'es') {
      i18n.changeLanguage('es');
    }

    // Set page title and meta tags
    document.title = 'EndoGuard™ - Plataforma de Inteligencia Hormonal | Nexus Biomedical';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'EndoGuard™ es una plataforma de inteligencia hormonal de grado clínico que evalúa su riesgo de disrupción hormonal por microplásticos y químicos disruptores endocrinos (EDC).');
    }
  }, [i18n]);

  const handleStartAssessment = () => {
    navigate('/endoguard/assessment');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white'
    }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
          padding: '0.5rem 1.5rem',
          borderRadius: '2rem',
          display: 'inline-block',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          🚀 Prueba Gratuita de 7 Días - Sin Tarjeta de Crédito
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '800',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 50%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          EndoGuard™
        </h1>

        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: '#e2e8f0'
        }}>
          Plataforma de Inteligencia Hormonal de Grado Clínico
        </h2>

        <p style={{
          fontSize: '1.25rem',
          lineHeight: '1.8',
          maxWidth: '800px',
          margin: '0 auto 3rem',
          color: '#cbd5e1'
        }}>
          Proteja su salud hormonal de los microplásticos y químicos disruptores endocrinos (EDC). 
          Evaluación integral con recomendaciones personalizadas basadas en evidencia científica.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleStartAssessment}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '0.75rem',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(217, 70, 239, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(217, 70, 239, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(217, 70, 239, 0.3)';
            }}
          >
            Comenzar Evaluación Gratuita →
          </button>

          <button
            onClick={() => window.scrollTo({ top: document.getElementById('features').offsetTop, behavior: 'smooth' })}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0.75rem',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            Más Información
          </button>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section id="features" style={{
        padding: '4rem 2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#f1f5f9'
          }}>
            ¿Por Qué EndoGuard™?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '🧪',
                title: 'Evaluación Integral de EDC',
                description: 'Analice su exposición a químicos disruptores endocrinos en productos diarios, alimentos, agua y ambiente.'
              },
              {
                icon: '📊',
                title: 'Puntuación de Riesgo Personalizada',
                description: 'Algoritmo de IA que calcula su nivel de riesgo basado en síntomas, estilo de vida y exposiciones ambientales.'
              },
              {
                icon: '💊',
                title: 'Recomendaciones Basadas en Evidencia',
                description: 'Reciba recomendaciones personalizadas de pruebas de laboratorio, cambios de estilo de vida y suplementos.'
              },
              {
                icon: '📱',
                title: 'Monitoreo Continuo',
                description: 'Seguimiento de progreso con evaluaciones periódicas y notificaciones SMS/email de recordatorios.'
              },
              {
                icon: '🔒',
                title: 'Seguro y Privado',
                description: 'Cumplimiento HIPAA con encriptación AES-256. Sus datos de salud están completamente protegidos.'
              },
              {
                icon: '🌟',
                title: 'Respaldo Científico',
                description: 'Basado en investigación científica publicada sobre EDCs, salud hormonal y medicina funcional.'
              }
            ].map((benefit, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'rgba(217, 70, 239, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{benefit.icon}</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#f1f5f9'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: '#cbd5e1'
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#f1f5f9'
        }}>
          Cómo Funciona
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              step: '1',
              title: 'Complete la Evaluación',
              description: 'Responda preguntas sobre síntomas, estilo de vida, exposiciones ambientales e historial de salud (10-15 minutos).'
            },
            {
              step: '2',
              title: 'Reciba Su Puntuación de Riesgo',
              description: 'Nuestro algoritmo de IA analiza sus respuestas y genera una puntuación de riesgo personalizada con análisis detallado.'
            },
            {
              step: '3',
              title: 'Obtenga Recomendaciones',
              description: 'Reciba recomendaciones personalizadas de pruebas de laboratorio, cambios de estilo de vida y estrategias de reducción de EDC.'
            },
            {
              step: '4',
              title: 'Monitoree Su Progreso',
              description: 'Realice evaluaciones periódicas para rastrear mejoras y reciba recordatorios automáticos por SMS/email.'
            }
          ].map((step, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '700',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 30px rgba(217, 70, 239, 0.3)'
              }}>
                {step.step}
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#f1f5f9'
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#cbd5e1'
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{
        padding: '4rem 2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#f1f5f9'
          }}>
            Precios Simples y Transparentes
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#cbd5e1',
            marginBottom: '3rem'
          }}>
            Comience con una prueba gratuita de 7 días. Sin tarjeta de crédito requerida.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Basic Plan */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#f1f5f9'
              }}>
                Plan Básico
              </h3>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#d946ef'
              }}>
                $39
                <span style={{ fontSize: '1.25rem', fontWeight: '400', color: '#cbd5e1' }}>/mes</span>
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '2rem'
              }}>
                o $390/año (ahorra 17%)
              </p>
              <ul style={{
                textAlign: 'left',
                listStyle: 'none',
                padding: 0,
                marginBottom: '2rem'
              }}>
                {[
                  'Evaluaciones ilimitadas',
                  'Puntuación de riesgo personalizada',
                  'Recomendaciones básicas',
                  'Notificaciones por email',
                  'Historial de evaluaciones'
                ].map((feature, idx) => (
                  <li key={idx} style={{
                    padding: '0.75rem 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1'
                  }}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleStartAssessment}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  background: 'rgba(217, 70, 239, 0.2)',
                  border: '2px solid #d946ef',
                  borderRadius: '0.75rem',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(217, 70, 239, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(217, 70, 239, 0.2)';
                }}
              >
                Comenzar Prueba Gratuita
              </button>
            </div>

            {/* Premium Plan */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
              padding: '2.5rem',
              borderRadius: '1rem',
              border: '2px solid #d946ef',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
                padding: '0.5rem 1.5rem',
                borderRadius: '2rem',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                MÁS POPULAR
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#f1f5f9'
              }}>
                Plan Premium
              </h3>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#d946ef'
              }}>
                $79
                <span style={{ fontSize: '1.25rem', fontWeight: '400', color: '#cbd5e1' }}>/mes</span>
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '2rem'
              }}>
                o $790/año (ahorra 17%)
              </p>
              <ul style={{
                textAlign: 'left',
                listStyle: 'none',
                padding: 0,
                marginBottom: '2rem'
              }}>
                {[
                  'Todo del Plan Básico',
                  'Notificaciones SMS',
                  'Informes clínicos detallados',
                  'Soporte prioritario',
                  'Herramienta de comparación',
                  'Acceso a futuras actualizaciones'
                ].map((feature, idx) => (
                  <li key={idx} style={{
                    padding: '0.75rem 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1'
                  }}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleStartAssessment}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(217, 70, 239, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(217, 70, 239, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(217, 70, 239, 0.3)';
                }}
              >
                Comenzar Prueba Gratuita
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: '#f1f5f9'
        }}>
          Proteja Su Salud Hormonal Hoy
        </h2>
        <p style={{
          fontSize: '1.25rem',
          lineHeight: '1.8',
          maxWidth: '700px',
          margin: '0 auto 2.5rem',
          color: '#cbd5e1'
        }}>
          Únase a miles de personas que están tomando control de su salud hormonal 
          con EndoGuard™. Comience su evaluación gratuita ahora.
        </p>
        <button
          onClick={handleStartAssessment}
          style={{
            padding: '1.25rem 3rem',
            fontSize: '1.25rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
            border: 'none',
            borderRadius: '0.75rem',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(217, 70, 239, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 15px 40px rgba(217, 70, 239, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(217, 70, 239, 0.3)';
          }}
        >
          Comenzar Evaluación Gratuita →
        </button>
        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: '#94a3b8'
        }}>
          ✓ Prueba gratuita de 7 días &nbsp;•&nbsp; ✓ Sin tarjeta de crédito &nbsp;•&nbsp; ✓ Cancele en cualquier momento
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default EndoGuardSpanishLanding;
