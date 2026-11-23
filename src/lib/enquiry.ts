import { z } from 'zod'
import { site } from '../config/site'

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, site.contact.nameError)
    .max(100, site.contact.nameError),
  email: z.email(site.contact.emailError).max(254, site.contact.emailError),
  services: z
    .array(
      z
        .string()
        .refine(
          (value) => site.services.items.some((item) => item.name === value),
          site.contact.needsError,
        ),
    )
    .max(4),
  budget: z
    .string()
    .refine(
      (value) =>
        value === '' || site.contact.budgets.some((option) => option === value),
      site.contact.budgetError,
    ),
  message: z
    .string()
    .trim()
    .min(10, site.contact.messageError)
    .max(5000, site.contact.messageError),
  website: z.string().max(500),
})
export type Enquiry = z.infer<typeof enquirySchema>
