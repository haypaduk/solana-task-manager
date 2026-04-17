use anchor_lang::prelude::*;

declare_id!("EqCG98vvRDT69zytGAEDTke9R7oCgEMQB98YZQ3YWzPg");

#[program]
pub mod task_manager {
    use super::*;

    pub fn create_task(
        ctx: Context<CreateTask>,
        task_id: u64,
        title: String,
        description: String,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.authority = ctx.accounts.authority.key();
        task.task_id = task_id;
        task.title = title;
        task.description = description;
        task.completed = false;
        msg!("Tarea creada: {} (ID: {})", task.title, task.task_id);
        Ok(())
    }

    pub fn update_task_content(
        ctx: Context<UpdateTask>,
        new_title: String,
        new_description: String,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.title = new_title;
        task.description = new_description;
        msg!("Tarea actualizada: {}", task.title);
        Ok(())
    }

    pub fn toggle_complete(ctx: Context<UpdateTask>) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.completed = !task.completed;
        let estado = if task.completed { "COMPLETADA" } else { "PENDIENTE" };
        msg!("Tarea marcada como {}", estado);
        Ok(())
    }

    pub fn delete_task(ctx: Context<DeleteTask>) -> Result<()> {
        msg!("Eliminando tarea: {}", ctx.accounts.task.title);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct CreateTask<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + (4 + 200) + (4 + 200) + 1,
        seeds = [b"task", task_id.to_le_bytes().as_ref()],
        bump
    )]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTask<'info> {
    #[account(mut, has_one = authority)]
    pub task: Account<'info, Task>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTask<'info> {
    #[account(mut, close = authority)]
    pub task: Account<'info, Task>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Task {
    pub authority: Pubkey,    // 32 bytes
    pub task_id: u64,          // 8 bytes
    pub title: String,         // 4 bytes (length) + contenido
    pub description: String,   // 4 bytes (length) + contenido
    pub completed: bool,       // 1 byte
}
