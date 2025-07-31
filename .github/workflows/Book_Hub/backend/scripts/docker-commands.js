console.log("🐳 Docker Commands Reference")
console.log("============================\n")

console.log("📦 Container Management:")
console.log("   docker ps                           # List running containers")
console.log("   docker ps -a                        # List all containers")
console.log("   docker start postgres-bookhub      # Start the database")
console.log("   docker stop postgres-bookhub       # Stop the database")
console.log("   docker restart postgres-bookhub    # Restart the database")
console.log("   docker rm postgres-bookhub         # Delete container\n")

console.log("📊 Monitoring:")
console.log("   docker logs postgres-bookhub       # View database logs")
console.log("   docker logs -f postgres-bookhub    # Follow logs in real-time")
console.log("   docker stats postgres-bookhub      # View resource usage\n")

console.log("🔧 Database Access:")
console.log("   docker exec -it postgres-bookhub psql -U postgres")
console.log("   # This opens PostgreSQL command line inside the container\n")

console.log("🗑️  Clean Reset (if needed):")
console.log("   docker stop postgres-bookhub")
console.log("   docker rm postgres-bookhub")
console.log("   # Then run: npm run docker-setup\n")

console.log("🎯 Quick Setup Command:")
console.log("   docker run --name postgres-bookhub -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres\n")

console.log("💡 Tips:")
console.log("   - Container data persists until you delete the container")
console.log("   - You can stop/start without losing data")
console.log("   - Port 5432 on your computer connects to PostgreSQL in container")
console.log('   - Password is always "postgres" (set when creating container)')
