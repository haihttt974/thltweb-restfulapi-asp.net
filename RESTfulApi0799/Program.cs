
using Microsoft.EntityFrameworkCore;
using RESTfulApi0799.Models;
using RESTfulApi0799.Repositories;

namespace RESTfulApi0799
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<ApplicationDbContext>(
                options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "MyAllowOrigins", policy =>
                {
                    //Thay bằng địa chỉ localhost khi khởi chạy bên frontend (VSCode) 
                    policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            //Đặt trên UseAuthorization
            app.UseCors("MyAllowOrigins");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
