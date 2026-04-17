// Cliente manual para demostrar CRUD completo
// Este código NO necesita imports, Playground lo maneja automáticamente

const taskId = new anchor.BN(1);

// Encontrar la PDA de la tarea
const [taskPda] = web3.PublicKey.findProgramAddressSync(
  [Buffer.from("task"), taskId.toArrayLike(Buffer, "le", 8)],
  pg.PROGRAM_ID
);

console.log("=== DEMOSTRACIÓN CRUD ===");
console.log("Program ID:", pg.PROGRAM_ID.toString());
console.log("PDA de la tarea:", taskPda.toString());
console.log("");

// ========== CREATE ==========
console.log("1. CREATE - Creando tarea...");
try {
  const createTx = await pg.program.methods
    .createTask(taskId, "Aprender Solana", "Completar el bootcamp")
    .accounts({
      task: taskPda,
      authority: pg.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
  
  await pg.connection.confirmTransaction(createTx);
  console.log("   Tarea creada! TX:", createTx);
} catch (e) {
  console.log("   La tarea ya existe o hubo un error:", e.message);
}

// ========== READ ==========
console.log("\n2. READ - Leyendo tarea...");
const taskAccount = await pg.program.account.task.fetch(taskPda);
console.log("   Título:", taskAccount.title);
console.log("   Descripción:", taskAccount.description);
console.log("   Completada:", taskAccount.completed);

// ========== UPDATE ==========
console.log("\n3. UPDATE - Actualizando tarea...");
const updateTx = await pg.program.methods
  .updateTaskContent("Aprender Solana con Anchor", "Ya entiendo PDAs y CRUD")
  .accounts({
    task: taskPda,
    authority: pg.wallet.publicKey,
  })
  .rpc();

await pg.connection.confirmTransaction(updateTx);
console.log("   Tarea actualizada! TX:", updateTx);

// Verificar UPDATE
const updatedTask = await pg.program.account.task.fetch(taskPda);
console.log("   Nuevo título:", updatedTask.title);

// ========== TOGGLE COMPLETE ==========
console.log("\n4. UPDATE (Toggle) - Marcando como completada...");
const toggleTx = await pg.program.methods
  .toggleComplete()
  .accounts({
    task: taskPda,
    authority: pg.wallet.publicKey,
  })
  .rpc();

await pg.connection.confirmTransaction(toggleTx);
console.log("   Estado cambiado! TX:", toggleTx);

// Verificar Toggle
const toggledTask = await pg.program.account.task.fetch(taskPda);
console.log("   Completada:", toggledTask.completed);

// ========== DELETE ==========
console.log("\n5. DELETE - Eliminando tarea...");
const deleteTx = await pg.program.methods
  .deleteTask()
  .accounts({
    task: taskPda,
    authority: pg.wallet.publicKey,
  })
  .rpc();

await pg.connection.confirmTransaction(deleteTx);
console.log("   Tarea eliminada! TX:", deleteTx);

// Verificar DELETE
try {
  await pg.program.account.task.fetch(taskPda);
  console.log("   ERROR: La tarea aún existe");
} catch (e) {
  console.log("   Verificado: La tarea ya no existe en la blockchain");
}

console.log("\n=== CRUD COMPLETADO EXITOSAMENTE ===");
