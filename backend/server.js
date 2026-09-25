import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


/* =========================================================
   CONFIGURACIÓN DE MONGODB
========================================================= */

const MONGODB_URI = process.env.MONGODB_URI;


/* =========================================================
   CONFIGURACIÓN DE CORREO
========================================================= */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.CORREO,
    pass: process.env.PASSWORD_CORREO,
  },
});


/* =========================================================
   CÓDIGOS DE RECUPERACIÓN
========================================================= */

const codigosRecuperacion = new Map();


/* =========================================================
   CREAR ROLES
========================================================= */

async function crearRoles() {

  try {

    const db = mongoose.connection.db;

    const cantidadRoles = await db
      .collection("roles")
      .countDocuments();

    if (cantidadRoles === 0) {

      await db.collection("roles").insertMany([

        {
          nombre: "Administrador",
          codigo: "ADMIN",
        },

        {
          nombre: "Profesor",
          codigo: "PROFESOR",
        },

        {
          nombre: "Estudiante",
          codigo: "ESTUDIANTE",
        },

      ]);

      console.log("Roles creados correctamente.");

    }

  } catch (error) {

    console.error(
      "Error creando roles:",
      error
    );

  }

}


/* =========================================================
   RUTA PRINCIPAL
========================================================= */

app.get("/", (req, res) => {

  res.json({
    mensaje: "Backend Live Green funcionando",
  });

});


/* =========================================================
   ROLES
========================================================= */

app.get("/api/roles", async (req, res) => {

  try {

    const db = mongoose.connection.db;

    const roles = await db
      .collection("roles")
      .find({})
      .toArray();

    res.json(roles);

  } catch (error) {

    console.error(
      "Error obteniendo roles:",
      error
    );

    res.status(500).json({
      mensaje: "Error obteniendo roles",
    });

  }

});


/* =========================================================
   USUARIOS
========================================================= */


/* =========================================================
   CREAR USUARIO
========================================================= */

app.post("/api/usuarios", async (req, res) => {

  try {

    const {
      nombres,
      apellidos,
      username,
      correo,
      telefono,
      fecha_nacimiento,
      rol,
      password,
    } = req.body;


    /* VALIDAR CAMPOS */

    if (
      !nombres ||
      !apellidos ||
      !username ||
      !correo ||
      !telefono ||
      !fecha_nacimiento ||
      !rol ||
      !password
    ) {

      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });

    }


    /* VALIDAR ROL */

    const rolesValidos = [
      "ADMIN",
      "PROFESOR",
      "ESTUDIANTE",
    ];

    if (!rolesValidos.includes(rol)) {

      return res.status(400).json({
        mensaje: "El rol no es válido",
      });

    }


    const db = mongoose.connection.db;


    /* VALIDAR CORREO */

    const correoLimpio =
      correo.trim().toLowerCase();

    const usuarioExistente =
      await db
        .collection("usuarios")
        .findOne({
          correo: correoLimpio,
        });


    if (usuarioExistente) {

      return res.status(400).json({
        mensaje: "El correo ya está registrado",
      });

    }


    /* VALIDAR USERNAME */

    const usernameLimpio =
      username.trim();

    const usernameExistente =
      await db
        .collection("usuarios")
        .findOne({
          username: usernameLimpio,
        });


    if (usernameExistente) {

      return res.status(400).json({
        mensaje:
          "El nombre de usuario ya está registrado",
      });

    }


    /* ENCRIPTAR CONTRASEÑA */

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );


    /* CREAR USUARIO */

    const nuevoUsuario = {

      nombres:
        nombres.trim(),

      apellidos:
        apellidos.trim(),

      username:
        usernameLimpio,

      correo:
        correoLimpio,

      telefono:
        telefono.trim(),

      fecha_nacimiento,

      rol,

      password:
        passwordHash,

      activo:
        true,

      fecha_registro:
        new Date(),

    };


    /* GUARDAR EN MONGODB */

    await db
      .collection("usuarios")
      .insertOne(nuevoUsuario);


    res.status(201).json({

      mensaje:
        "Usuario registrado correctamente",

    });

  } catch (error) {

    console.error(
      "Error creando usuario:",
      error
    );

    res.status(500).json({
      mensaje: "Error creando usuario",
    });

  }

});


/* =========================================================
   OBTENER USUARIOS
========================================================= */

app.get("/api/usuarios", async (req, res) => {

  try {

    const db = mongoose.connection.db;

    const usuarios = await db
      .collection("usuarios")
      .find({})
      .project({
        password: 0,
      })
      .sort({
        fecha_registro: -1,
      })
      .toArray();

    res.json(usuarios);

  } catch (error) {

    console.error(
      "Error obteniendo usuarios:",
      error
    );

    res.status(500).json({
      mensaje: "Error obteniendo usuarios",
    });

  }

});


/* =========================================================
   ELIMINAR USUARIO
========================================================= */

app.delete("/api/usuarios/:id", async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        mensaje: "ID de usuario inválido",
      });

    }


    const db = mongoose.connection.db;


    const resultado =
      await db
        .collection("usuarios")
        .deleteOne({

          _id:
            new mongoose.Types.ObjectId(id),

        });


    if (
      resultado.deletedCount === 0
    ) {

      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });

    }


    res.json({

      mensaje:
        "Usuario eliminado correctamente",

    });

  } catch (error) {

    console.error(
      "Error eliminando usuario:",
      error
    );

    res.status(500).json({
      mensaje: "Error eliminando usuario",
    });

  }

});


/* =========================================================
   LOGIN
========================================================= */

app.post("/api/login", async (req, res) => {

  try {

    const {
      correo,
      password,
    } = req.body;


    if (
      !correo ||
      !password
    ) {

      return res.status(400).json({
        mensaje:
          "Correo y contraseña son obligatorios",
      });

    }


    const db = mongoose.connection.db;


    const usuario =
      await db
        .collection("usuarios")
        .findOne({

          correo:
            correo
              .trim()
              .toLowerCase(),

        });


    if (!usuario) {

      return res.status(401).json({
        mensaje:
          "Correo o contraseña incorrectos",
      });

    }


    /* VERIFICAR SI ESTÁ ACTIVO */

    if (
      usuario.activo === false
    ) {

      return res.status(403).json({
        mensaje:
          "El usuario está desactivado",
      });

    }


    /* COMPARAR CONTRASEÑA */

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        usuario.password
      );


    if (!passwordCorrecta) {

      return res.status(401).json({
        mensaje:
          "Correo o contraseña incorrectos",
      });

    }


    const usuarioRespuesta = {

      _id:
        usuario._id,

      nombres:
        usuario.nombres,

      apellidos:
        usuario.apellidos,

      username:
        usuario.username,

      correo:
        usuario.correo,

      telefono:
        usuario.telefono,

      fecha_nacimiento:
        usuario.fecha_nacimiento,

      rol:
        usuario.rol,

      activo:
        usuario.activo,

    };


    res.json({

      mensaje:
        "Inicio de sesión correcto",

      usuario:
        usuarioRespuesta,

    });

  } catch (error) {

    console.error(
      "Error en login:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error en el inicio de sesión",
    });

  }

});


/* =========================================================
   RECUPERACIÓN DE CONTRASEÑA
========================================================= */


/* =========================================================
   ENVIAR CÓDIGO
========================================================= */

app.post("/enviar-codigo", async (req, res) => {

  try {

    const {
      correo,
    } = req.body;


    if (!correo) {

      return res.status(400).json({
        mensaje:
          "El correo es obligatorio",
      });

    }


    const db = mongoose.connection.db;


    const correoLimpio =
      correo
        .trim()
        .toLowerCase();


    const usuario =
      await db
        .collection("usuarios")
        .findOne({
          correo:
            correoLimpio,
        });


    if (!usuario) {

      return res.status(404).json({
        mensaje:
          "No existe un usuario con ese correo",
      });

    }


    const codigo =
      crypto
        .randomInt(
          100000,
          1000000
        )
        .toString();


    codigosRecuperacion.set(

      correoLimpio,

      {
        codigo,

        expira:
          Date.now() +
          10 * 60 * 1000,
      }

    );


    await transporter.sendMail({

      from:
        process.env.CORREO,

      to:
        correo,

      subject:
        "Código de recuperación - Live Green",

      text:
        `Tu código de recuperación es: ${codigo}. Este código es válido durante 10 minutos.`,

    });


    res.json({

      mensaje:
        "Código enviado correctamente",

    });

  } catch (error) {

    console.error(
      "Error enviando código:",
      error
    );

    res.status(500).json({
      mensaje:
        "No se pudo enviar el código",
    });

  }

});


/* =========================================================
   VERIFICAR CÓDIGO
========================================================= */

app.post("/verificar-codigo", async (req, res) => {

  try {

    const {
      correo,
      codigo,
    } = req.body;


    if (
      !correo ||
      !codigo
    ) {

      return res.status(400).json({
        mensaje:
          "Correo y código son obligatorios",
      });

    }


    const correoLimpio =
      correo
        .trim()
        .toLowerCase();


    const datos =
      codigosRecuperacion.get(
        correoLimpio
      );


    if (!datos) {

      return res.status(400).json({
        mensaje:
          "No existe un código de recuperación",
      });

    }


    if (
      Date.now() >
      datos.expira
    ) {

      codigosRecuperacion.delete(
        correoLimpio
      );

      return res.status(400).json({
        mensaje:
          "El código ha expirado",
      });

    }


    if (
      datos.codigo !==
      codigo.toString()
    ) {

      return res.status(400).json({
        mensaje:
          "Código incorrecto",
      });

    }


    res.json({

      mensaje:
        "Código correcto",

    });

  } catch (error) {

    console.error(
      "Error verificando código:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error verificando código",
    });

  }

});


/* =========================================================
   CAMBIAR CONTRASEÑA
========================================================= */

app.post("/cambiar-contrasena", async (req, res) => {

  try {

    const {
      correo,
      codigo,
      nuevaPassword,
    } = req.body;


    if (
      !correo ||
      !codigo ||
      !nuevaPassword
    ) {

      return res.status(400).json({
        mensaje:
          "Todos los campos son obligatorios",
      });

    }


    const correoLimpio =
      correo
        .trim()
        .toLowerCase();


    const datos =
      codigosRecuperacion.get(
        correoLimpio
      );


    if (!datos) {

      return res.status(400).json({
        mensaje:
          "Código inválido",
      });

    }


    if (
      Date.now() >
      datos.expira
    ) {

      codigosRecuperacion.delete(
        correoLimpio
      );

      return res.status(400).json({
        mensaje:
          "El código ha expirado",
      });

    }


    if (
      datos.codigo !==
      codigo.toString()
    ) {

      return res.status(400).json({
        mensaje:
          "Código incorrecto",
      });

    }


    const passwordHash =
      await bcrypt.hash(
        nuevaPassword,
        10
      );


    const db = mongoose.connection.db;


    await db
      .collection("usuarios")
      .updateOne(

        {
          correo:
            correoLimpio,
        },

        {
          $set: {
            password:
              passwordHash,
          },
        }

      );


    codigosRecuperacion.delete(
      correoLimpio
    );


    res.json({

      mensaje:
        "Contraseña actualizada correctamente",

    });

  } catch (error) {

    console.error(
      "Error cambiando contraseña:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error cambiando contraseña",
    });

  }

});


/* =========================================================
   FUNCIÓN PARA FILTRAR REGISTROS
========================================================= */

function filtroActivo(req) {

  const esAdministrador =
    req.query.admin === "true";


  if (esAdministrador) {

    return {};

  }


  return {

    activo: {
      $ne: false,
    },

  };

}


/* =========================================================
   ESPECIES
========================================================= */


/* OBTENER ESPECIES */

app.get("/api/especies", async (req, res) => {

  try {

    const db = mongoose.connection.db;

    const especies =
      await db
        .collection("especies")
        .find(
          filtroActivo(req)
        )
        .sort({
          fecha_registro: -1,
        })
        .toArray();


    res.json(especies);

  } catch (error) {

    console.error(
      "Error obteniendo especies:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error obteniendo especies",
    });

  }

});


/* CREAR ESPECIE */

app.post("/api/especies", async (req, res) => {

  try {

    const {
      nombre,
      tipo_planta,
      clima_recomendado,
    } = req.body;


    if (
      !nombre ||
      !tipo_planta ||
      !clima_recomendado
    ) {

      return res.status(400).json({
        mensaje:
          "El nombre, tipo de planta y clima recomendado son obligatorios",
      });

    }


    const db = mongoose.connection.db;


    const nuevaEspecie = {

      nombre:
        nombre.trim(),

      tipo_planta:
        tipo_planta.trim(),

      clima_recomendado:
        clima_recomendado.trim(),

      activo:
        true,

      fecha_registro:
        new Date(),

    };


    await db
      .collection("especies")
      .insertOne(
        nuevaEspecie
      );


    res.status(201).json({

      mensaje:
        "Especie creada correctamente",

      especie:
        nuevaEspecie,

    });

  } catch (error) {

    console.error(
      "Error creando especie:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error creando especie",
    });

  }

});


/* ELIMINAR ESPECIE */

app.delete("/api/especies/:id", async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        mensaje:
          "ID inválido",
      });

    }


    const db = mongoose.connection.db;


    const resultado =
      await db
        .collection("especies")
        .deleteOne({

          _id:
            new mongoose.Types.ObjectId(id),

        });


    if (
      resultado.deletedCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          "Especie no encontrada",
      });

    }


    res.json({

      mensaje:
        "Especie eliminada correctamente",

    });

  } catch (error) {

    console.error(
      "Error eliminando especie:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error eliminando especie",
    });

  }

});


/* =========================================================
   PLANTAS
========================================================= */


/* OBTENER PLANTAS */

app.get("/api/plantas", async (req, res) => {

  try {

    const db = mongoose.connection.db;

    const plantas =
      await db
        .collection("plantas")
        .find(
          filtroActivo(req)
        )
        .sort({
          fecha_registro: -1,
        })
        .toArray();


    res.json(plantas);

  } catch (error) {

    console.error(
      "Error obteniendo plantas:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error obteniendo plantas",
    });

  }

});


/* CREAR PLANTA */

app.post("/api/plantas", async (req, res) => {

  try {

    const {
      nombre,
      descripcion,
      id_especie,
    } = req.body;


    if (
      !nombre ||
      !descripcion ||
      !id_especie
    ) {

      return res.status(400).json({
        mensaje:
          "El nombre, descripción y especie son obligatorios",
      });

    }


    if (
      !mongoose.Types.ObjectId.isValid(
        id_especie
      )
    ) {

      return res.status(400).json({
        mensaje:
          "La especie seleccionada no es válida",
      });

    }


    const db = mongoose.connection.db;


    const especieExiste =
      await db
        .collection("especies")
        .findOne({

          _id:
            new mongoose.Types.ObjectId(
              id_especie
            ),

        });


    if (!especieExiste) {

      return res.status(404).json({
        mensaje:
          "La especie no existe",
      });

    }


    const nuevaPlanta = {

      nombre:
        nombre.trim(),

      descripcion:
        descripcion.trim(),

      id_especie:
        new mongoose.Types.ObjectId(
          id_especie
        ),

      activo:
        true,

      fecha_registro:
        new Date(),

    };


    await db
      .collection("plantas")
      .insertOne(
        nuevaPlanta
      );


    res.status(201).json({

      mensaje:
        "Planta creada correctamente",

      planta:
        nuevaPlanta,

    });

  } catch (error) {

    console.error(
      "Error creando planta:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error creando planta",
    });

  }

});


/* ELIMINAR PLANTA */

app.delete("/api/plantas/:id", async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        mensaje:
          "ID inválido",
      });

    }


    const db = mongoose.connection.db;


    const resultado =
      await db
        .collection("plantas")
        .deleteOne({

          _id:
            new mongoose.Types.ObjectId(id),

        });


    if (
      resultado.deletedCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          "Planta no encontrada",
      });

    }


    res.json({

      mensaje:
        "Planta eliminada correctamente",

    });

  } catch (error) {

    console.error(
      "Error eliminando planta:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error eliminando planta",
    });

  }

});


/* =========================================================
   CUIDADOS
========================================================= */


/* OBTENER CUIDADOS */

app.get("/api/cuidados", async (req, res) => {

  try {

    const db = mongoose.connection.db;

    const cuidados =
      await db
        .collection("cuidados")
        .find(
          filtroActivo(req)
        )
        .sort({
          fecha_registro: -1,
        })
        .toArray();


    res.json(cuidados);

  } catch (error) {

    console.error(
      "Error obteniendo cuidados:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error obteniendo cuidados",
    });

  }

});


/* CREAR CUIDADO */

app.post("/api/cuidados", async (req, res) => {

  try {

    const {
      observaciones,
      fecha,
      tipo_cuidado,
      id_planta,
    } = req.body;


    if (
      !observaciones ||
      !fecha ||
      !tipo_cuidado ||
      !id_planta
    ) {

      return res.status(400).json({
        mensaje:
          "Todos los campos del cuidado son obligatorios",
      });

    }


    if (
      !mongoose.Types.ObjectId.isValid(
        id_planta
      )
    ) {

      return res.status(400).json({
        mensaje:
          "La planta seleccionada no es válida",
      });

    }


    const db = mongoose.connection.db;


    const plantaExiste =
      await db
        .collection("plantas")
        .findOne({

          _id:
            new mongoose.Types.ObjectId(
              id_planta
            ),

        });


    if (!plantaExiste) {

      return res.status(404).json({
        mensaje:
          "La planta no existe",
      });

    }


    const nuevoCuidado = {

      observaciones:
        observaciones.trim(),

      fecha:
        fecha.trim(),

      tipo_cuidado:
        tipo_cuidado.trim(),

      id_planta:
        new mongoose.Types.ObjectId(
          id_planta
        ),

      activo:
        true,

      fecha_registro:
        new Date(),

    };


    await db
      .collection("cuidados")
      .insertOne(
        nuevoCuidado
      );


    res.status(201).json({

      mensaje:
        "Cuidado creado correctamente",

      cuidado:
        nuevoCuidado,

    });

  } catch (error) {

    console.error(
      "Error creando cuidado:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error creando cuidado",
    });

  }

});


/* ELIMINAR CUIDADO */

app.delete("/api/cuidados/:id", async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        mensaje:
          "ID inválido",
      });

    }


    const db = mongoose.connection.db;


    const resultado =
      await db
        .collection("cuidados")
        .deleteOne({

          _id:
            new mongoose.Types.ObjectId(id),

        });


    if (
      resultado.deletedCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          "Cuidado no encontrado",
      });

    }


    res.json({

      mensaje:
        "Cuidado eliminado correctamente",

    });

  } catch (error) {

    console.error(
      "Error eliminando cuidado:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error eliminando cuidado",
    });

  }

});


/* =========================================================
   MATERIAL DE APOYO
========================================================= */


/* OBTENER MATERIALES */

app.get("/api/materiales", async (req, res) => {

  try {

    const db = mongoose.connection.db;


    const materiales =
      await db
        .collection("materiales_apoyo")
        .find(
          filtroActivo(req)
        )
        .sort({
          fecha_registro: -1,
        })
        .toArray();


    res.json(materiales);

  } catch (error) {

    console.error(
      "Error obteniendo materiales:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error obteniendo materiales",
    });

  }

});


/* CREAR MATERIAL */

app.post("/api/materiales", async (req, res) => {

  try {

    const {
      titulo,
      contenido,
      fecha,
    } = req.body;


    if (
      !titulo ||
      !contenido ||
      !fecha
    ) {

      return res.status(400).json({
        mensaje:
          "El título, contenido y fecha son obligatorios",
      });

    }


    const db = mongoose.connection.db;


    const nuevoMaterial = {

      titulo:
        titulo.trim(),

      contenido:
        contenido.trim(),

      fecha:
        fecha.trim(),

      activo:
        true,

      fecha_registro:
        new Date(),

    };


    await db
      .collection("materiales_apoyo")
      .insertOne(
        nuevoMaterial
      );


    res.status(201).json({

      mensaje:
        "Material creado correctamente",

      material:
        nuevoMaterial,

    });

  } catch (error) {

    console.error(
      "Error creando material:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error creando material",
    });

  }

});


/* ELIMINAR MATERIAL */

app.delete("/api/materiales/:id", async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        mensaje:
          "ID inválido",
      });

    }


    const db = mongoose.connection.db;


    const resultado =
      await db
        .collection("materiales_apoyo")
        .deleteOne({

          _id:
            new mongoose.Types.ObjectId(id),

        });


    if (
      resultado.deletedCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          "Material no encontrado",
      });

    }


    res.json({

      mensaje:
        "Material eliminado correctamente",

    });

  } catch (error) {

    console.error(
      "Error eliminando material:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error eliminando material",
    });

  }

});


/* =========================================================
   JUEGOS
========================================================= */


/* OBTENER JUEGOS */

app.get("/api/juegos", async (req, res) => {

  try {

    const db = mongoose.connection.db;


    const juegos =
      await db
        .collection("juegos")
        .find(
          filtroActivo(req)
        )
        .sort({
          fecha_registro: -1,
        })
        .toArray();


    res.json(juegos);

  } catch (error) {

    console.error(
      "Error obteniendo juegos:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error obteniendo juegos",
    });

  }

});


/* CREAR JUEGO */

app.post("/api/juegos", async (req, res) => {

  try {

    const {
      nombre_juego,
      descripcion,
      id_material,
    } = req.body;


    if (
      !nombre_juego ||
      !descripcion ||
      !id_material
    ) {

      return res.status(400).json({
        mensaje:
          "El nombre, descripción y material son obligatorios",
      });

    }


    if (
      !mongoose.Types.ObjectId.isValid(
        id_material
      )
    ) {

      return res.status(400).json({
        mensaje:
          "El material seleccionado no es válido",
      });

    }


    const db = mongoose.connection.db;


    const materialExiste =
      await db
        .collection("materiales_apoyo")
        .findOne({

          _id:
            new mongoose.Types.ObjectId(
              id_material
            ),

        });


    if (!materialExiste) {

      return res.status(404).json({
        mensaje:
          "El material no existe",
      });

    }


    const nuevoJuego = {

      nombre_juego:
        nombre_juego.trim(),

      descripcion:
        descripcion.trim(),

      id_material:
        new mongoose.Types.ObjectId(
          id_material
        ),

      activo:
        true,

      fecha_registro:
        new Date(),

    };


    await db
      .collection("juegos")
      .insertOne(
        nuevoJuego
      );


    res.status(201).json({

      mensaje:
        "Juego creado correctamente",

      juego:
        nuevoJuego,

    });

  } catch (error) {

    console.error(
      "Error creando juego:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error creando juego",
    });

  }

});


/* ELIMINAR JUEGO */

app.delete("/api/juegos/:id", async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        mensaje:
          "ID inválido",
      });

    }


    const db = mongoose.connection.db;


    const resultado =
      await db
        .collection("juegos")
        .deleteOne({

          _id:
            new mongoose.Types.ObjectId(id),

        });


    if (
      resultado.deletedCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          "Juego no encontrado",
      });

    }


    res.json({

      mensaje:
        "Juego eliminado correctamente",

    });

  } catch (error) {

    console.error(
      "Error eliminando juego:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error eliminando juego",
    });

  }

});


/* =========================================================
   SOPORTE
========================================================= */


/* OBTENER SOPORTES */

app.get("/api/soportes", async (req, res) => {

  try {

    const db = mongoose.connection.db;


    const soportes =
      await db
        .collection("soportes")
        .find(
          filtroActivo(req)
        )
        .sort({
          fecha_registro: -1,
        })
        .toArray();


    res.json(soportes);

  } catch (error) {

    console.error(
      "Error obteniendo soportes:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error obteniendo soportes",
    });

  }

});


/* CREAR SOPORTE */

app.post("/api/soportes", async (req, res) => {

  try {

    const {
      asunto,
      mensaje,
      fecha_mensaje,
      estado,
      id_resultado,
    } = req.body;


    if (
      !asunto ||
      !mensaje ||
      !fecha_mensaje ||
      !estado ||
      !id_resultado
    ) {

      return res.status(400).json({
        mensaje:
          "Todos los campos del soporte son obligatorios",
      });

    }


    const db = mongoose.connection.db;


    const nuevoSoporte = {

      asunto:
        asunto.trim(),

      mensaje:
        mensaje.trim(),

      fecha_mensaje:
        fecha_mensaje.trim(),

      estado:
        estado.trim(),

      id_resultado:
        id_resultado.trim(),

      activo:
        true,

      fecha_registro:
        new Date(),

    };


    await db
      .collection("soportes")
      .insertOne(
        nuevoSoporte
      );


    res.status(201).json({

      mensaje:
        "Soporte creado correctamente",

      soporte:
        nuevoSoporte,

    });

  } catch (error) {

    console.error(
      "Error creando soporte:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error creando soporte",
    });

  }

});


/* ELIMINAR SOPORTE */

app.delete("/api/soportes/:id", async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        mensaje:
          "ID inválido",
      });

    }


    const db = mongoose.connection.db;


    const resultado =
      await db
        .collection("soportes")
        .deleteOne({

          _id:
            new mongoose.Types.ObjectId(id),

        });


    if (
      resultado.deletedCount === 0
    ) {

      return res.status(404).json({
        mensaje:
          "Soporte no encontrado",
      });

    }


    res.json({

      mensaje:
        "Soporte eliminado correctamente",

    });

  } catch (error) {

    console.error(
      "Error eliminando soporte:",
      error
    );

    res.status(500).json({
      mensaje:
        "Error eliminando soporte",
    });

  }

});


/* =========================================================
   COLECCIONES PERMITIDAS PARA EDITAR Y ESTADO
========================================================= */

const coleccionesPermitidas = {

  usuarios:
    "usuarios",

  especies:
    "especies",

  plantas:
    "plantas",

  cuidados:
    "cuidados",

  materiales:
    "materiales_apoyo",

  juegos:
    "juegos",

  soportes:
    "soportes",

};


/* =========================================================
   CAMPOS PERMITIDOS PARA EDITAR
========================================================= */

const camposPermitidos = {

  usuarios: [

    "nombres",
    "apellidos",
    "username",
    "correo",
    "telefono",
    "fecha_nacimiento",
    "rol",

  ],

  especies: [

    "nombre",
    "tipo_planta",
    "clima_recomendado",

  ],

  plantas: [

    "nombre",
    "descripcion",
    "id_especie",

  ],

  cuidados: [

    "observaciones",
    "fecha",
    "tipo_cuidado",
    "id_planta",

  ],

  materiales: [

    "titulo",
    "contenido",
    "fecha",

  ],

  juegos: [

    "nombre_juego",
    "descripcion",
    "id_material",

  ],

  soportes: [

    "asunto",
    "mensaje",
    "fecha_mensaje",
    "estado",
    "id_resultado",

  ],

};


/* =========================================================
   EDITAR REGISTRO
========================================================= */

app.put(
  "/api/:coleccion/:id",
  async (req, res) => {

    try {

      const {
        coleccion,
        id,
      } = req.params;


      /* VERIFICAR COLECCIÓN */

      if (
        !coleccionesPermitidas[coleccion]
      ) {

        return res.status(400).json({
          mensaje:
            "La colección no está permitida",
        });

      }


      /* VERIFICAR ID */

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {

        return res.status(400).json({
          mensaje:
            "ID inválido",
        });

      }


      const db = mongoose.connection.db;

      const campos =
        camposPermitidos[coleccion];

      const datosActualizados = {};


      /* =========================================
         TOMAR SOLAMENTE CAMPOS PERMITIDOS
      ========================================= */

      for (
        const campo of campos
      ) {

        if (
          req.body[campo] !== undefined
        ) {

          let valor =
            req.body[campo];


          if (
            typeof valor === "string"
          ) {

            valor =
              valor.trim();

          }


          datosActualizados[campo] =
            valor;

        }

      }


      /* =========================================
         VALIDAR ROL DE USUARIO
      ========================================= */

      if (
        coleccion === "usuarios" &&
        datosActualizados.rol !== undefined
      ) {

        const rolesValidos = [

          "ADMIN",
          "PROFESOR",
          "ESTUDIANTE",

        ];


        if (
          !rolesValidos.includes(
            datosActualizados.rol
          )
        ) {

          return res.status(400).json({
            mensaje:
              "El rol seleccionado no es válido",
          });

        }

      }


      /* =========================================
         VALIDAR CORREO
      ========================================= */

      if (
        coleccion === "usuarios" &&
        datosActualizados.correo !== undefined
      ) {

        datosActualizados.correo =
          datosActualizados.correo
            .trim()
            .toLowerCase();


        const usuarioExistente =
          await db
            .collection("usuarios")
            .findOne({

              correo:
                datosActualizados.correo,

              _id: {
                $ne:
                  new mongoose.Types.ObjectId(
                    id
                  ),
              },

            });


        if (
          usuarioExistente
        ) {

          return res.status(400).json({
            mensaje:
              "El correo ya está registrado por otro usuario",
          });

        }

      }


      /* =========================================
         VALIDAR USERNAME
      ========================================= */

      if (
        coleccion === "usuarios" &&
        datosActualizados.username !== undefined
      ) {

        const usernameExistente =
          await db
            .collection("usuarios")
            .findOne({

              username:
                datosActualizados.username,

              _id: {
                $ne:
                  new mongoose.Types.ObjectId(
                    id
                  ),
              },

            });


        if (
          usernameExistente
        ) {

          return res.status(400).json({
            mensaje:
              "El nombre de usuario ya está registrado por otro usuario",
          });

        }

      }


      /* =========================================
         CONVERTIR ID DE ESPECIE
      ========================================= */

      if (
        coleccion === "plantas"
      ) {

        if (
          datosActualizados.id_especie
        ) {

          if (
            !mongoose.Types.ObjectId.isValid(
              datosActualizados.id_especie
            )
          ) {

            return res.status(400).json({
              mensaje:
                "La especie seleccionada no es válida",
            });

          }


          datosActualizados.id_especie =
            new mongoose.Types.ObjectId(
              datosActualizados.id_especie
            );

        }

      }


      /* =========================================
         CONVERTIR ID DE PLANTA
      ========================================= */

      if (
        coleccion === "cuidados"
      ) {

        if (
          datosActualizados.id_planta
        ) {

          if (
            !mongoose.Types.ObjectId.isValid(
              datosActualizados.id_planta
            )
          ) {

            return res.status(400).json({
              mensaje:
                "La planta seleccionada no es válida",
            });

          }


          datosActualizados.id_planta =
            new mongoose.Types.ObjectId(
              datosActualizados.id_planta
            );

        }

      }


      /* =========================================
         CONVERTIR ID DE MATERIAL
      ========================================= */

      if (
        coleccion === "juegos"
      ) {

        if (
          datosActualizados.id_material
        ) {

          if (
            !mongoose.Types.ObjectId.isValid(
              datosActualizados.id_material
            )
          ) {

            return res.status(400).json({
              mensaje:
                "El material seleccionado no es válido",
            });

          }


          datosActualizados.id_material =
            new mongoose.Types.ObjectId(
              datosActualizados.id_material
            );

        }

      }


      /* =========================================
         CAMPOS QUE NO SE PUEDEN MODIFICAR
      ========================================= */

      delete datosActualizados._id;

      delete datosActualizados.id;

      delete datosActualizados.activo;

      delete datosActualizados.fecha_registro;

      delete datosActualizados.password;


      /* =========================================
         VERIFICAR QUE EXISTAN DATOS
      ========================================= */

      if (
        Object.keys(
          datosActualizados
        ).length === 0
      ) {

        return res.status(400).json({
          mensaje:
            "No hay datos para actualizar",
        });

      }


      /* =========================================
         ACTUALIZAR
      ========================================= */

      const resultado =
        await db
          .collection(
            coleccionesPermitidas[
              coleccion
            ]
          )
          .updateOne(

            {
              _id:
                new mongoose.Types.ObjectId(
                  id
                ),
            },

            {
              $set:
                datosActualizados,
            }

          );


      if (
        resultado.matchedCount === 0
      ) {

        return res.status(404).json({
          mensaje:
            "Registro no encontrado",
        });

      }


      res.json({

        mensaje:
          "Registro actualizado correctamente",

      });

    } catch (error) {

      console.error(
        "Error editando registro:",
        error
      );

      res.status(500).json({
        mensaje:
          "Error editando registro",
      });

    }

  }
);


/* =========================================================
   ACTIVAR / DESACTIVAR
========================================================= */

app.patch(
  "/api/:coleccion/:id/estado",
  async (req, res) => {

    try {

      const {
        coleccion,
        id,
      } = req.params;

      const {
        activo,
      } = req.body;


      /* VERIFICAR COLECCIÓN */

      if (
        !coleccionesPermitidas[
          coleccion
        ]
      ) {

        return res.status(400).json({
          mensaje:
            "La colección no está permitida",
        });

      }


      /* VERIFICAR ID */

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        return res.status(400).json({
          mensaje:
            "ID inválido",
        });

      }


      /* VERIFICAR ACTIVO */

      if (
        typeof activo !== "boolean"
      ) {

        return res.status(400).json({
          mensaje:
            "El campo activo debe ser true o false",
        });

      }


      const db = mongoose.connection.db;


      /* ACTUALIZAR ESTADO */

      const resultado =
        await db
          .collection(
            coleccionesPermitidas[
              coleccion
            ]
          )
          .updateOne(

            {
              _id:
                new mongoose.Types.ObjectId(
                  id
                ),
            },

            {
              $set: {
                activo,
              },
            }

          );


      if (
        resultado.matchedCount === 0
      ) {

        return res.status(404).json({
          mensaje:
            "Registro no encontrado",
        });

      }


      res.json({

        mensaje:
          activo
            ? "Registro activado correctamente"
            : "Registro desactivado correctamente",

        activo,

      });

    } catch (error) {

      console.error(
        "Error cambiando estado:",
        error
      );

      res.status(500).json({
        mensaje:
          "Error cambiando estado",
      });

    }

  }
);


/* =========================================================
   RUTA 404
========================================================= */

app.use((req, res) => {

  res.status(404).json({

    mensaje:
      "Ruta no encontrada",

  });

});


/* =========================================================
   INICIAR SERVIDOR
========================================================= */

async function iniciarServidor() {

  try {

    await mongoose.connect(
      MONGODB_URI
    );


    console.log(
      "MongoDB Atlas conectado"
    );


    await crearRoles();


    /* =========================================
       VERIFICAR CORREO
    ========================================= */

    transporter.verify(
      (error) => {

        if (error) {

          console.log(
            "No se pudo verificar el correo:",
            error.message
          );

        } else {

          console.log(
            "Servicio de correo listo"
          );

        }

      }
    );


    /* =========================================
       INICIAR SERVIDOR
    ========================================= */

    app.listen(
      PORT,
      () => {

        console.log(
          `Servidor ejecutándose en http://localhost:${PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      "Error conectando con MongoDB:",
      error
    );

  }

}


iniciarServidor();