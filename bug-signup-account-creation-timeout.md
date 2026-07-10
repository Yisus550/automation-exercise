# Bug Report: [Signup]/Account creation confirmation never appears

## Descripción
Durante la verificación de los cambios implementados se ejecutó el test existente `tests/e2e/signup.spec.ts`. El test llega al paso "Fill the account information form and submit it", completa todos los campos del formulario y hace clic en "Create Account", pero la página nunca muestra el encabezado de confirmación `ACCOUNT CREATED!`. El test falla por timeout tanto en la ejecución original como en el reintento, incluso aumentando el timeout a 60000 ms. Este comportamiento ocurre también con el código original de `login.page.ts` (sin los cambios del login), por lo que no fue introducido por los nuevos tests de login.

## Severidad
S1 - Crítica

## Resultado esperado
Tras completar el formulario de registro con datos válidos y hacer clic en el botón "Create Account", la aplicación debe procesar la solicitud y mostrar la pantalla de confirmación con el mensaje `ACCOUNT CREATED!`, permitiendo continuar con el flujo de registro.

## Resultados obtenidos
El botón "Create Account" se hace clic, pero el encabezado `ACCOUNT CREATED!` no llega a ser visible. Playwright reporta timeout esperando el locator:

```
waiting for getByRole('heading', { name: 'ACCOUNT CREATED!' }) to be visible
Test timeout of 60000ms exceeded.
```

Además, el endpoint `POST /api/createAccount` responde correctamente con `{"responseCode": 201, "message": "User created!"}` cuando se prueba directamente, lo que indica que la creación de cuentas por API funciona, pero el flujo UI de signup no refleja el éxito de la operación.
