// No imports needed: web3, anchor, pg and more are globally available in Solana Playground [citation:10]

describe("Task Manager", () => {
  
  it("Crea una tarea", async () => {
    const taskId = new anchor.BN(1);
    const title = "Aprender Solana";
    const description = "Completar el bootcamp con Anchor";

    // Encuentra la dirección de la PDA (Program Derived Address) [citation:2][citation:9]
    const [taskPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("task"), taskId.toArrayLike(Buffer, "le", 8)],
      pg.PROGRAM_ID
    );

    // Enviar la transacción
    const txHash = await pg.program.methods
      .createTask(taskId, title, description)
      .accounts({
        task: taskPda,
        authority: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log(`Transacción enviada: ${txHash}`);
    await pg.connection.confirmTransaction(txHash);

    // Leer la cuenta recién creada (READ) [citation:3]
    const taskAccount = await pg.program.account.task.fetch(taskPda);
    
    // Verificaciones usando 'assert' (disponible globalmente) [citation:1][citation:6]
    assert.equal(taskAccount.title, title);
    assert.equal(taskAccount.description, description);
    assert.equal(taskAccount.completed, false);
    
    console.log("Prueba CREATE exitosa. Tarea:", taskAccount.title);
  });

  it("Actualiza una tarea", async () => {
    const taskId = new anchor.BN(1);
    const newTitle = "Aprender Solana con Anchor";
    const newDescription = "Ya entiendo PDAs y CRUD";

    const [taskPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("task"), taskId.toArrayLike(Buffer, "le", 8)],
      pg.PROGRAM_ID
    );

    const txHash = await pg.program.methods
      .updateTaskContent(newTitle, newDescription)
      .accounts({
        task: taskPda,
        authority: pg.wallet.publicKey,
      })
      .rpc();

    console.log(`Transacción enviada: ${txHash}`);
    await pg.connection.confirmTransaction(txHash);

    const taskAccount = await pg.program.account.task.fetch(taskPda);
    
    assert.equal(taskAccount.title, newTitle);
    assert.equal(taskAccount.description, newDescription);
    
    console.log("Prueba UPDATE exitosa. Nuevo título:", taskAccount.title);
  });

  it("Marca tarea como completada", async () => {
    const taskId = new anchor.BN(1);

    const [taskPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("task"), taskId.toArrayLike(Buffer, "le", 8)],
      pg.PROGRAM_ID
    );

    const txHash = await pg.program.methods
      .toggleComplete()
      .accounts({
        task: taskPda,
        authority: pg.wallet.publicKey,
      })
      .rpc();

    console.log(`Transacción enviada: ${txHash}`);
    await pg.connection.confirmTransaction(txHash);

    const taskAccount = await pg.program.account.task.fetch(taskPda);
    
    assert.equal(taskAccount.completed, true);
    
    console.log("Prueba UPDATE (toggle) exitosa. Tarea completada.");
  });

it("Elimina una tarea", async () => {
  const taskId = new anchor.BN(1); // Asegúrate de usar el MISMO taskId que al crear

  const [taskPda] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("task"), taskId.toArrayLike(Buffer, "le", 8)],
    pg.PROGRAM_ID
  );

  console.log("Intentando eliminar tarea en PDA:", taskPda.toString());

  // Verificar que la cuenta existe ANTES de eliminar
  try {
    const cuentaAntes = await pg.program.account.task.fetch(taskPda);
    console.log("Cuenta encontrada. Título:", cuentaAntes.title);
  } catch (error) {
    console.log("La cuenta no existe antes de eliminar. Creando una nueva...");
    
    // Si no existe, la creamos nuevamente para poder eliminarla
    await pg.program.methods
      .createTask(taskId, "Tarea temporal para eliminar", "Esta tarea será eliminada")
      .accounts({
        task: taskPda,
        authority: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("Tarea temporal creada");
  }

  // Ahora sí, ejecutar la eliminación
  const txHash = await pg.program.methods
    .deleteTask()
    .accounts({
      task: taskPda,
      authority: pg.wallet.publicKey,
    })
    .rpc();

  console.log(`Transacción de eliminación enviada: ${txHash}`);
  await pg.connection.confirmTransaction(txHash);

  // Verificar que ya no existe
  try {
    await pg.program.account.task.fetch(taskPda);
    throw new Error("La tarea debería haber sido eliminada pero aún existe");
  } catch (error) {
    if (error instanceof Error && error.message.includes("Account does not exist")) {
      console.log("Prueba DELETE exitosa. Cuenta eliminada correctamente.");
    } else {
      throw error;
    }
  }
});
