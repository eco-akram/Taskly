using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;

public class LoginCommandHandler(IAppDbContext db, IJwtService jwt) : IRequestHandler<LoginCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        return new AuthResponseDto(jwt.GenerateToken(user), user.FullName, user.Email);
    }
}
