using MediatR;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;
using Taskly.Domain.Entities;

namespace Taskly.Application.Projects.Commands;

public record CreateProjectCommand(string Name, string? Description, Guid OwnerId) : IRequest<ProjectDto>;

public class CreateProjectCommandHandler(IAppDbContext db) : IRequestHandler<CreateProjectCommand, ProjectDto>
{
    public async Task<ProjectDto> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = Project.Create(request.Name, request.Description, request.OwnerId);
        db.Projects.Add(project);
        await db.SaveChangesAsync(cancellationToken);
        return new ProjectDto(project.Id, project.Name, project.Description, project.CreatedAt, 0);
    }
}
