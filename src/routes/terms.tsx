import { createFileRoute } from '@tanstack/react-router'
import { Legal, legalHead } from '../components/sections/Legal'
export const Route = createFileRoute('/terms')({
  head: () => legalHead('terms'),
  component: () => <Legal kind="terms" />,
})
