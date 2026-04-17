# solana-task-manager
Programa CRUD en Solana con Anchor para gestión de tareas.
# Solana Task Manager

## Descripción
Programa CRUD (Create, Read, Update, Delete) desarrollado en Solana con Anchor para gestionar tareas. Utiliza PDAs (Program Derived Addresses) para identificar cada tarea de forma única.

## Funcionalidades (CRUD + PDA)

| Operación | Función | Descripción |
|-----------|---------|-------------|
| **Create** | `create_task` | Crear una nueva tarea con título y descripción |
| **Read** | `fetch` (cliente) | Leer los datos de una tarea existente |
| **Update** | `update_task_content` | Actualizar título y descripción |
| **Update** | `toggle_complete` | Marcar tarea como completada/pendiente |
| **Delete** | `delete_task` | Eliminar una tarea y recuperar rent |

## Estructura de la cuenta (Task)

```rust
pub struct Task {
    pub authority: Pubkey,   // Quién creó la tarea
    pub task_id: u64,         // ID único de la tarea
    pub title: String,        // Título (máx 200 chars)
    pub description: String,  // Descripción (máx 200 chars)
    pub completed: bool,      // Estado: completada/pendiente
}

Tecnologías usadas
Rust + Anchor (Framework)

Solana Devnet (Red de pruebas)

PDAs para direcciones determinísticas

Instalación y prueba
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/solana-task-manager

# Construir el programa
anchor build

# Desplegar en Devnet
anchor deploy

# Ejecutar pruebas
anchor test

Program ID (Devnet)
EqCG98vvRDT69zytGAEDTke9R7oCgEMQB98YZQ3YWzPg


Demostración
Al ejecutar el cliente se pueden ver las 5 operaciones:
Running client...
  client.ts:
    === DEMOSTRACIÓN CRUD ===
    Program ID: EqCG98vvRDT69zytGAEDTke9R7oCgEMQB98YZQ3YWzPg
    PDA de la tarea: 2ZFAirsbroY3yugdJKWSG1nV8mysYKxACQWifCRb1h2W
    
    1. CREATE - Creando tarea...
       ✅ Tarea creada! TX: 4tcYfUCJA8bpE9g7CrRfMNE5vJXT2EKUxzugG2f6g8EqJ3njKjA8NxFGn7W7fwEMQae6QJrzxp4s9GPZXA2NxfgJ
    
2. READ - Leyendo tarea...
       📋 Título: Aprender Solana
       📝 Descripción: Completar el bootcamp
       ✅ Completada: false
    
3. UPDATE - Actualizando tarea...
       ✅ Tarea actualizada! TX: 5dfFSw1w1P38k8XtrDrBsRZSwmxWxVmBcM6PsuWNU9nTe5VeaFoyS99SE34oherJ5ZMhndZp8CHonzRn7B5WQDz2
       📋 Nuevo título: Aprender Solana con Anchor
    
4. UPDATE (Toggle) - Marcando como completada...
       ✅ Estado cambiado! TX: 3aSYqspcbTodPeBgGwEoxG6twysqLwDMRi47zV1X6MLWqoLTCgDsHCL6hEccM834hxuSSoaLFcFsjEkkjcrFTMDt
       ✅ Completada: true
    
5. DELETE - Eliminando tarea...
       ✅ Tarea eliminada! TX: 642WG3DWqeDaD7XR9mnoL4jcobs2BCmkoH45dLk1vH9apsB2JW2zRSjT9smgfJv1nQBfrijCGKrZHSbv69sCabCr
       ✅ Verificado: La tarea ya no existe en la blockchain
    
=== CRUD COMPLETADO EXITOSAMENTE ===
Autor:
Colin Martinez Josef Bnejamin - Bootcamp Solana Developer
