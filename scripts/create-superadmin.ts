import * as readline from 'readline'
import { prisma } from '../lib/db'
import { hashPassword } from '../lib/auth'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  try {
    console.log('Create Super Admin Account')
    console.log('==========================')

    const email = await question('Enter email: ')
    const password = await question('Enter password: ')
    const confirmPassword = await question('Confirm password: ')

    if (password !== confirmPassword) {
      console.error('Passwords do not match!')
      process.exit(1)
    }

    if (password.length < 6) {
      console.error('Password must be at least 6 characters long!')
      process.exit(1)
    }

    // Check if super admin already exists
    const existingAdmin = await prisma.pengguna.findFirst({
      where: { role: 'SUPER_ADMIN' }
    })

    if (existingAdmin) {
      console.error('Super admin already exists!')
      process.exit(1)
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.pengguna.create({
      data: {
        email,
        password: hashedPassword,
        nama: 'Super Admin',
        role: 'SUPER_ADMIN'
      }
    })

    console.log(`Super admin created successfully!`)
    console.log(`Email: ${user.email}`)
    console.log(`ID: ${user.id}`)

  } catch (error) {
    console.error('Error creating super admin:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

main()