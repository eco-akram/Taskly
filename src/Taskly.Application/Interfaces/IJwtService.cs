using Taskly.Domain.Entities;

namespace Taskly.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
