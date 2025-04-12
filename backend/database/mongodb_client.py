from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config
from datetime import datetime

class MongoDB:
    client: AsyncIOMotorClient = None
    database = None

    @classmethod
    async def connect_db(cls):
        try:
            cls.client = AsyncIOMotorClient(config("MONGO_URI"))
            cls.database = cls.client["healthportai_db"]
            # Verify connection
            await cls.client.admin.command('ping')
            print(f"Connected to MongoDB Atlas")
        except Exception as e:
            print(f"Could not connect to MongoDB Atlas: {e}")
            raise e

    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()
            print("MongoDB connection closed")

    @classmethod
    async def get_database(cls):
        return cls.database

    @classmethod
    async def save_data(cls, collection_name: str, data: dict):
        collection = cls.database[collection_name]
        await collection.insert_one(data)

    @classmethod
    async def get_data(cls, collection_name: str, query: dict):
        collection = cls.database[collection_name]
        return await collection.find(query).to_list(length=100)