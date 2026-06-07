using MediatR;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;
using Taskly.Domain.Entities;

namespace Taskly.Application.Auth.Commands;

public record RegisterCommand(string FullName, string Email, string Password) : IRequest<AuthResponseDto>;

public class RegisterCommandHandler(IAppDbContext db, IJwtService jwt) : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        if (db.Users.Any(u => u.Email == request.Email))
            throw new InvalidOperationException("Email already in use.");

        var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var user = User.Create(request.FullName, request.Email, hash);
        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);

        return new AuthResponseDto(jwt.GenerateToken(user), user.FullName, user.Email);
    }
}
