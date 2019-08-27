"use strict";

const Hapi = require("@hapi/hapi");
const vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const handlebars = require("handlebars");
const path = require("path");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: "localhost"
  });

  await server.register(vision);
  await server.register(Inert);
  await server.start();
  await server.views({
    engines: { html: handlebars },
    relativeTo: __dirname,
    path: path.resolve(__dirname)
  });

  await server.route({
    method: "GET",
    path: "/",
    handler: function(request, h) {
      return h.view("home");
    }
  });

  await server.route({
    path: "/assets/{path*}",
    method: "GET",
    handler: {
      directory: {
        path: path.join(__dirname, "./assets/"),
        listing: false,
        index: false
      }
    }
  });

  await server.route({
    path: "/js/{path*}",
    method: "GET",
    handler: {
      directory: {
        path: path.join(__dirname, "./js/"),
        listing: false,
        index: false
      }
    }
  });

  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
