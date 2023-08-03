commands:
	pnpm create svelte@latest sveltekit-jwt-authentication
	pnpm prisma init --datasource-provider postgresql
	pnpm prisma migrate dev --name init
	pnpm prisma migrate reset

install-packages:
	pnpm add @prisma/client zod bcryptjs jose
	pnpm add -D prisma @types/bcryptjs