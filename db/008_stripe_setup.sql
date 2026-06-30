-- Migracion -008 - Setup de Stripe para anticipos
-- agrega campos a cotizaciones para tracking de pago de anticipo
--  + tabla para idempotencia de webhooks


ALTER TABLE cotizaciones
    ADD COLUMN monyo_anticipo NUMERIC(10, 2), 
    ADD COLUMN anticipo_pagado_at TIMESTAMPTZ, 
    ADD COLUMN stripe_session_id TEXT;

CREATE INDEX idx_cotizaciones_stripe_session_id
    ON cotizaciones(stripe_session_id)
    WHERE stripe_session_id IS NOT NULL;

COMMENT ON COLUMN cotizaciones.monto_anticipo IS
    'Monto del anticipo cobrado via Stripe (50%  si total <= 5000)';
COMMENT ON COLUMN cotizaciones.anticipo_pagado_At IS
    'Timestamp cuando Stripe confirmp el pago via webhook. BULl = no pagado todavia';
COMMENT ON COLUMN cotizaciones.stripe_session_id IS
    'ID de la Checkout Session de Stripe. Se asigna al crear la session, antes del pago';


CREATE TABLE stripe_eventos_procesados(
    id BIGSERIAL PRIMARY KEY, 
    evento_id TEXT UNIQUE NOT NULL,
    tipo TEXT NOT NULL,
    procesado_At TIMESTAMPTZ DEFAULT NOW ()
);

CREATE INDEX idx_stripe_eventos_tipo
    ON stripe_eventos_pprocesados(tipo);

COMMENT ON TABLE stripe_eventos_procesados IS
    'Registrp de eventos de webhoook ya procesados. Garantiza idempotencia: si Stripe manda el mismo evento dos veces, el UNIQUE constraint evita doble procesamiento ';
COMMENT ON COLUMN stripe_eventos_procesados.evento_id IS
    'ID unicop del evento de Stripe \. Viene en el payload del webhook';