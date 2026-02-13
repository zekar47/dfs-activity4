---
title: "Sistema Web de Gestión de Productos con Autenticación JWT"
author: "Nombre del Estudiante"
date: "\today"
lang: es
fontsize: 12pt
geometry: margin=2.5cm
toc: true
toc-depth: 3
numbersections: true
header-includes:
  - \usepackage{setspace}
  - \usepackage{graphicx}
  - \usepackage{float}
  - \usepackage{booktabs}
  - \usepackage{longtable}
  - \usepackage{array}
  - \usepackage{hyperref}
  - \usepackage{xcolor}
  - \usepackage{fancyhdr}
  - \usepackage{titlesec}
  - \usepackage{amsmath}
  - \usepackage{enumitem}
  - \usepackage{caption}
  - \usepackage{subcaption}
  - \onehalfspacing
  - \pagestyle{fancy}
  - \fancyhf{}
  - \rhead{Sistema de Gestión de Productos}
  - \lhead{Node.js + MongoDB}
  - \cfoot{\thepage}
---

# 1. Introducción

Este documento describe el desarrollo de una aplicación web para la gestión de productos que implementa operaciones CRUD protegidas mediante autenticación basada en JWT.

La aplicación fue desarrollada utilizando:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Jest
- GitHub Actions (CI/CD)
- Despliegue en Uberspace

---

# 2. Objetivo del Proyecto

Desarrollar una aplicación web backend segura que permita:

- Registro y autenticación de usuarios.
- Gestión CRUD de productos.
- Protección de rutas mediante JWT.
- Implementación de pruebas unitarias.
- Automatización del despliegue con CI/CD.

---

# 3. Requerimientos Funcionales

## 3.1 Gestión de Usuarios

RF-01: El sistema debe permitir el registro de usuarios.  
RF-02: El sistema debe permitir el inicio de sesión.  
RF-03: El sistema debe generar un token JWT tras autenticación exitosa.  
RF-04: El sistema debe permitir cerrar sesión (invalidación en cliente).  

## 3.2 Gestión de Productos

RF-05: El usuario autenticado podrá crear productos.  
RF-06: El usuario autenticado podrá visualizar productos.  
RF-07: El usuario autenticado podrá actualizar productos.  
RF-08: El usuario autenticado podrá eliminar productos.  

## 3.3 Seguridad

RF-09: Las rutas de productos deben estar protegidas mediante JWT.  
RF-10: El sistema debe validar el token en cada solicitud protegida.  

## 3.4 Interfaz

RF-11: Debe existir una vista HTML estática para login.  

---

# 4. Requerimientos No Funcionales

RNF-01: La aplicación debe seguir arquitectura RESTful.  
RNF-02: El sistema debe responder en menos de 500ms en condiciones normales.  
RNF-03: Las contraseñas deben almacenarse encriptadas (bcrypt).  
RNF-04: El código debe estar estructurado en capas (rutas, controladores, modelos).  
RNF-05: El sistema debe contar con pruebas unitarias automatizadas.  
RNF-06: El despliegue debe estar automatizado mediante CI/CD.  
RNF-07: El sistema debe ejecutarse en entorno Linux (Uberspace).  

---

# 5. Arquitectura del Sistema

## 5.1 Arquitectura General

Arquitectura en capas:

- Rutas (Routes)
- Controladores (Controllers)
- Modelos (Models)
- Middlewares (Auth)
- Base de datos (MongoDB)

## 5.2 Flujo de Autenticación

1. Usuario envía credenciales.
2. Servidor valida usuario.
3. Se genera JWT firmado.
4. Cliente envía token en header Authorization.
5. Middleware verifica token.

---

# 6. Modelo de Datos

## 6.1 Entidades

### Usuario
- _id
- nombre
- email
- password
- createdAt

### Producto
- _id
- nombre
- descripcion
- precio
- usuario_id
- createdAt

---

# 7. Diagrama Entidad-Relación

```mermaid
erDiagram
    USUARIO ||--o{ PRODUCTO : crea
    USUARIO {
        string _id
        string nombre
        string email
        string password
    }
    PRODUCTO {
        string _id
        string nombre
        string descripcion
        number precio
        string usuario_id
    }
````

Descripción:

Un usuario puede crear múltiples productos.
Cada producto pertenece a un único usuario.

---

# 8. Configuración del Servidor

## 8.1 Dependencias principales

* express
* mongoose
* jsonwebtoken
* bcryptjs
* dotenv
* jest
* supertest

## 8.2 Middlewares

* express.json()
* middleware de autenticación JWT
* middleware de manejo de errores

---

# 9. Controladores

## 9.1 UserController

* register()
* login()

## 9.2 ProductController

* createProduct()
* getProducts()
* updateProduct()
* deleteProduct()

Cada controlador interactúa con MongoDB mediante Mongoose.

---

# 10. Pruebas Unitarias

Se configuró Jest para:

* Probar controladores.
* Probar rutas protegidas.
* Validar generación y verificación de JWT.

Se utilizó Copilot para generar pruebas base, las cuales fueron ajustadas manualmente para:

* Cubrir casos de error.
* Validar permisos.
* Simular base de datos con mocks.

Cobertura mínima objetivo: 80%.

---

# 11. CI/CD con GitHub Actions

Pipeline automatizado:

1. Instalación de dependencias.
2. Ejecución de pruebas.
3. Build.
4. Despliegue automático a servidor Uberspace vía SSH.

Ejemplo de workflow:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

---

# 12. Justificación de la Plataforma SaaS

Se eligió Uberspace por las siguientes razones:

* Acceso completo por SSH.
* Entorno Linux configurable.
* Experiencia previa en administración Unix.
* Flexibilidad para ejecutar Node.js sin limitaciones serverless.
* Control total sobre variables de entorno y procesos.

A diferencia de plataformas serverless, Uberspace permite:

* Control de puertos
* Gestión manual de procesos
* Configuración personalizada de MongoDB o conexión remota

---

# 13. Instrucciones de Ejecución

1. Clonar repositorio.
2. Instalar dependencias:

```
npm install
```

3. Configurar variables en `.env`:

```
PORT=3000
MONGO_URI=...
JWT_SECRET=...
```

4. Ejecutar servidor:

```
npm run dev
```

---

# 14. Repositorio

El repositorio incluye:

* Código fuente completo
* Configuración CI/CD
* Archivo README
* Pruebas unitarias
* Documentación

Enlace:
(Agregar URL de GitHub)

---

# 15. Conclusión

El proyecto implementa una arquitectura backend segura utilizando JWT, MongoDB y Node.js, incorporando buenas prácticas de desarrollo, pruebas automatizadas y despliegue continuo.

La solución es escalable, segura y lista para entornos productivos.
