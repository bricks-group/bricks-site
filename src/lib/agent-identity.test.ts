import { test } from 'node:test'
import assert from 'node:assert/strict'
import { agentIdentityError } from './agent-identity'

test('agent listing booking needs name, email and brokerage', () => {
  const ok = { agent_name: 'Ana', email: 'ana@acme.ca', brokerage: 'Acme Realty Inc., Brokerage' }
  assert.equal(agentIdentityError(ok), null)
  assert.match(agentIdentityError({ ...ok, brokerage: '  ' })!, /brokerage/)
  assert.match(agentIdentityError({ ...ok, agent_name: '' })!, /agent_name/)
  assert.match(agentIdentityError({ ...ok, email: 'nope' })!, /email/)
})
