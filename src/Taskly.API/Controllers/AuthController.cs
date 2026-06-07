using MediatR;
using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Auth.Commands;

namespace Taskly.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        => Ok(await mediator.Send(command));

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
        => Ok(await mediator.Send(command));
}
