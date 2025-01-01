This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Logica

Existen dos modos:
El check de "seleccionar todos" activa el modo:

- `inclusive`: (Selecciona todos esta deseleccionado): seleccionar de a uno por uno y guardar esos items para 
mostrarlos en la lista de la derecha.
En este caso el infinite scroll de la derecha no esta habilitado

- `exclusive`: (Seleccionar todo esta seleccionado): deselecciona uno por uno y se guardan estos items para
deseleccionar en la lista de la derecha.
En este caso se activa el infinite scroll en la derecha

## UI

<img src="https://github.com/CrissAlvarezH/check-lists/blob/main/docs/images/preview.png" />
