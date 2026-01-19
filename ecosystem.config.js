module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "/home/ec2-user/app/backend",
      script: "npm",
      args: "start",
    },
    {
      name: "frontend",
      cwd: "/home/ec2-user/app/frontend",
      script: "npm",
      args: "start",
    }
  ]
}