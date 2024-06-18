const { response } = require('express');
const { generateJWT } = require('../helpers/jwt');
const Event = require('../models/event');

const getEvents = async (req, res = response) => {
  try {
    const events = await Event.find().populate('user', 'name');
    return res.status(201).json({
      ok: true,
      events,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador',
    });
  }
};

const createEvent = async (req, res = response) => {
  try {
    let event = new Event(req.body);
    event.user = req.uid;
    const savedEvent = await event.save();
    return res.status(201).json({
      ok: true,
      event: savedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador',
    });
  }
};

const updateEvent = async (req, res = response) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        message: 'El evento no existe',
      });
    }
    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        message: 'No puedes editar el evento de otro usuario',
      });
    }
    const eventToUpdate = { ...req.body, user: req.uid };
    const savedEvent = await Event.findByIdAndUpdate(eventId, eventToUpdate, { new: true });
    return res.status(201).json({
      ok: true,
      event: savedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador',
    });
  }
};

const deleteEvent = async (req, res = response) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        message: 'El evento no existe',
      });
    }
    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        message: 'No puedes eliminar el evento de otro usuario',
      });
    }
    await Event.findByIdAndDelete(eventId);
    return res.status(201).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador',
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
