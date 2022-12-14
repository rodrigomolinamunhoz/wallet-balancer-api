"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("users", "UserController.store");
Route.post("sessions", "SessionController.store");
Route.post("analista", "AnalistaController.store");
Route.post("cliente", "ClienteController.store");
Route.post("convidar-cliente", "ConviteController.convidar");
