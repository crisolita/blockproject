import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  asignarDorsal,
  createEvent,
  getAll,
  getAllInscripcionesCompradas,
  getAllInscripcionesVendidas,
  getEvent,
  getInscripcionesByEvent,
  getNFTS,
  getNFTSByEventsVendidos,
  getNFTSByUser,
  updateEvent,
} from "../controllers/eventos";
import { isOrganizador } from "../middleware/isOrganizador";
import Joivalidator from "express-joi-validation";
const validator = Joivalidator.createValidator();

import multer from "multer";
import {
  querySchemaCreateEvent,
  querySchemaDorsal,
  querySchemaEditEvent,
  querySchemaGetEvent,
} from "../middleware/validation";

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacena la imagen en la memoria, puedes ajustarlo según tus necesidades
const upload = multer({ storage: storage });
const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post(
  "/createEvent",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validator.body(querySchemaCreateEvent),
  isOrganizador,
  createEvent
);
router.post(
  "/dorsal",
  authenticateToken,
  validator.body(querySchemaDorsal),
  asignarDorsal
);

router.put(
  "/updateEvent",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validator.body(querySchemaEditEvent),
  isOrganizador,
  updateEvent
);
// router.delete("/deleteEvent",isOrganizador, deleteEvent);
router.post("/", getAll);
router.post("/event", validator.body(querySchemaGetEvent), getEvent);
router.post("/nfts", authenticateToken, getNFTS);

router.post("/nftsVendidosByEvent", authenticateToken, getNFTSByEventsVendidos);
router.post("/nftsByUserByEvent", authenticateToken, getNFTSByUser);
router.get("/nftsAllVendidos", authenticateToken, getAllInscripcionesVendidas);
router.get("/nftsAllByUser", authenticateToken, getAllInscripcionesCompradas);
router.post("/orders", authenticateToken, getInscripcionesByEvent);

export default router;
