package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Todo struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // omitempty if you don't write it will give you default value like 000000000000000000000000
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
}

var collection *mongo.Collection

func main() {
	fmt.Println("Hello World")

	// In case of production
	// if os.Getenv("ENV") == "production" {
	// 	// Load the .env file if not in production
	// 	//  MongoDB Database
	// 	err := godotenv.Load(".env")
	// 	if err != nil {
	// 		log.Fatal("Error loading .env file")
	// 	}
	// }

	// //  MongoDB Database
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// MongoDB Connection
	MONGODB_URL := os.Getenv("MONGO_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URL)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB Successfully")

	// Collection of database
	collection = client.Database("golang_db").Collection("todos")

	app := fiber.New()

	// In Not In Production coz it is a security issue
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowHeaders:     []string{"Origin,Content-Type,Accept"},
	}))

	app.Get("/", testApi)
	app.Get("/api/todos", getTodos)
	app.Post("/api/todo", createTodo)
	app.Patch("/api/todo/:id", updateTodo)
	app.Delete("/api/todo/:id", deleteTodo)

	//  Server
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "3000"
	}

	// In Production
	// if os.Getenv("ENV") == "production" {
	// 	// Serve static files from "Frontend/dist" in production
	// 	app.Get("/*", func(c fiber.Ctx) error {
	// 		filePath := "./Frontend/dist" + c.Path()
	// 		if _, err := os.Stat(filePath); os.IsNotExist(err) {
	// 			return c.Status(404).SendString("File Not Found")
	// 		}
	// 		return c.SendFile(filePath)
	// 	})
	// }

	log.Fatal(app.Listen("0.0.0.0:" + PORT))
}

func testApi(c fiber.Ctx) error {
	return c.Status(200).JSON(fiber.Map{
		"message": "hello world",
	})
}

func getTodos(c fiber.Ctx) error {
	var todos []Todo

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var todo Todo
		if err := cursor.Decode(&todo); err != nil {
			return err
		}

		todos = append(todos, todo)
	}

	return c.Status(200).JSON(todos)

}
func createTodo(c fiber.Ctx) error {
	todo := new(Todo)

	if err := c.Bind().Body(todo); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "error parsing body",
		})
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{
			"message": "body is empty",
		})
	}

	insertResult, err := collection.InsertOne(context.Background(), todo)
	if err != nil {
		return err
	}

	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(200).JSON(todo)
}

func updateTodo(c fiber.Ctx) error {
	id := c.Params("id")

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid Todo Id",
		})
	}

	filter := bson.M{"_id": objectId} // if you leave as an empty map it will give you all the data
	update := bson.M{"$set": bson.M{"completed": true}}
	result, err := collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid Todo Id",
		})
	}

	fmt.Println("Modify Count", result.ModifiedCount)

	return c.Status(200).JSON(fiber.Map{
		"message": "todo updated",
	})
}

func deleteTodo(c fiber.Ctx) error {
	id := c.Params("id")

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid Todo Id",
		})
	}

	filter := bson.M{"_id": objectId} // if you leave as an empty map it will give you all the data

	result, err := collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid Todo Id",
		})
	}

	fmt.Println("Delete Count", result.DeletedCount)

	return c.Status(200).JSON(fiber.Map{
		"message": "todo deleted",
	})

}
