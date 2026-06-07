using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Tasks.Queries;

public record GetTasksByProjectQuery(Guid ProjectId, Guid RequesterId) : IRequest<List<TaskDto>>;

public class GetTasksByProjectQueryHandler(IAppDbContext db) : IRequestHandler<GetTasksByProjectQuery, List<TaskDto>>
{
    public async Task<List<TaskDto>> Handle(GetTasksByProjectQuery request, CancellationToken cancellationToken)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId, cancellationToken)
            ?? throw new KeyNotFoundException("Project not found.");

        if (project.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Access denied.");

        return await db.Tasks
            .Where(t => t.ProjectId == request.ProjectId)
            .Select(t => new TaskDto(t.Id, t.Title, t.Description, t.Status.ToString(), t.Priority.ToString(), t.DueDate, t.ProjectId, t.AssigneeId, t.CreatedAt))
            .ToListAsync(cancellationToken);
    }
}
