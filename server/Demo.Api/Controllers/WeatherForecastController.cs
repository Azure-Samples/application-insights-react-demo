using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Demo.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly TelemetryClient _telemetryClient;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, TelemetryClient telemetryClient)
        {
            _logger = logger;
            _telemetryClient = telemetryClient;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            _logger.LogInformation("SERVER: Weather forecast requested");
            
            var weather = GenerateRandomWeather();
            
            _logger.LogInformation("SERVER: returning {WeatherCount} records", weather.Length);
            return weather;
        }

        private WeatherForecast[] GenerateRandomWeather()
        {
            var span = new Activity(nameof(GenerateRandomWeather));
            span.SetParentId(Activity.Current.TraceId, Activity.Current.SpanId, Activity.Current.ActivityTraceFlags);
            
            using var scope = _logger.BeginScope(new Dictionary<string, object>
            {
                ["TraceId"] = span.TraceId,
                ["SpanId"] = span.SpanId, 
                ["ParentId"] = span.ParentSpanId
            });
            span.Start();

            
            // App Insights treats traces as children of the current span, so records the
            // current span-id in ParentId for traces.
            
            // StartOperation generates AppDependency with the previous span-id (span.ParentId) as ParentId,
            // and the new span-id (span.SpanId) as the Id, then sets the App Insights
            // context ParentId to the span-id (span.SpanId) for future AppTraces.
            var operation = _telemetryClient.StartOperation<DependencyTelemetry>(span);

            try
            {
                var rng = new Random();
                var weather = Enumerable.Range(1, 5).Select(index => new WeatherForecast
                    {
                        Date = DateTime.Now.AddDays(index),
                        TemperatureC = rng.Next(-20, 55),
                        Summary = Summaries[rng.Next(Summaries.Length)]
                    })
                    .ToArray();
                _logger.LogInformation("SERVER: generated {WeatherCount} records", weather.Length);
                return weather;
            }
            finally
            {
                _telemetryClient.StopOperation(operation);
                span.Stop();
            }
        }
    }
}
