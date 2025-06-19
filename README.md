# RESTfulApi0799

This project demonstrates a simple ASP.NET 9 Web API for managing products.

## Features
- CRUD endpoints under `/api/products`
- Entity Framework Core with SQL Server
- Built-in Swagger UI for testing
- Simple HTML frontend in `wwwroot`

## Prerequisites
- .NET 9 SDK
- SQL Server instance

## Build and Run
1. Ensure the connection string in `RESTfulApi0799/appsettings.json` points to your SQL Server.
2. Run the application:

   ```bash
   dotnet run --project RESTfulApi0799
   ```

The API will start and Swagger UI will be available at `https://localhost:<port>/swagger`.

## Notes
- Static pages in `RESTfulApi0799/wwwroot` provide a simple frontend for testing the API.
- Swagger can be used to send requests and inspect responses during development.
