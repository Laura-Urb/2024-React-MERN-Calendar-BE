/* 
    Rutas de Eventos
    host + /api/events

 */

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controller/events');
const { isDate } = require('../helpers/isDate');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const router = Router();

//Todas llamadas pasan por validateJWT
router.use(validateJWT);

router.get('/', getEvents);
router.post(
  '/',
  [
    //middleware
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de fin es obligatoria').custom(isDate),
    validateFields,
  ],
  createEvent
);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
