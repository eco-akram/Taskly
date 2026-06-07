using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Tasks.Commands;
using Taskly.Application.Tasks.Queries;
using Taskly.Domain.Enums;

namespace Taskly.API.Controllers;

[ApiController]
[Route("api/projects/{projectId:guid}/tasks")]
[Authorize]
public class TasksController(IMediator mediator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid projectId)
        => Ok(await mediator.Send(new GetTasksByProjectQuery(projectId, UserId)));

    [HttpPost]
    public async Task<IActionResult> Create(Guid projectId, [FromBody] CreateTaskRequest request)
    {
        var result = await mediator.Send(new CreateTaskCommand(request.Title, request.Description, request.Priority, request.DueDate, projectId, UserId, request.AssigneeId));
        return CreatedAtAction(nameof(GetAll), new { projectId }, result);
    }

    [HttpPatch("{taskId:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid projectId, Guid taskId, [FromBody] UpdateStatusRequest request)
        => Ok(await mediator.Send(new UpdateTaskStatusCommand(taskId, request.Status, UserId)));

    [HttpDelete("{taskId:guid}")]
    public async Task<IActionResult> Delete(Guid projectId, Guid taskId)
    {
        await mediator.Send(new DeleteTaskCommand(taskId, UserId));
        return NoContent();
    }
}

public record CreateTaskRequest(string Title, string? Description, TaskPriority Priority, DateTime? DueDate, Guid? AssigneeId);
public record UpdateStatusRequest(TaskStatus Status);
