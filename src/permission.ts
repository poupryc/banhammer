/**
 * ==== Authorization ====
 * Default            - 0
 * Dev                - 1
 * Junior staff       - 2
 * Senior staff       - 3
 * Modo               - 4
 * Admin              - 5
 * =======================
 *    - Do not touch -
 */

const permission = new Map<string, number>()
  .set('323128117721825311', 1) // HelloEdit#0376
  .set('140470684026404866', 1) // Loki#7958
  .set('417334046486691851', 2)
  .set('417333721767608331', 3)
  .set('417333433912655882', 4)
  .set('417332951605313546', 5)
  .set('417332738853568512', 5)
  .set('131545054786355200', 5) // Neremsa#9242

// for development purpose
if (process.env.NODE_ENV === 'dev') {
  permission
    .set('323128117721825311', 5) // HelloEdit#0376
    .set('140470684026404866', 5) // Loki#7958
}

export { permission }
