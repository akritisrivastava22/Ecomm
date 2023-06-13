import Collection from "../models/collection";
import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/customError";

export const createCollection = asyncHandler(async (req,res) => {
    const {name} = req.body

    if(!name){
        throw new CustomError("User not found", 404)
    }

    const collection = await Collection.create({
        name
    })

    req.status(200).json({
        success: true,
        message: "Collection was created succesfully",
        collection
    })
})

export const updateCollection = asyncHandler(async (req,res) => {
    const {name} = req.body
    const {id: collectionId} = req.params

    if(!name){
        throw new CustomError("Collection name is required", 404)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(collectionId, {
        name
    },{
        new:true,
        runValidators: true
    })

    if(!updatedCollection){
        throw new CustomError("Collection not found", 404)
    }

    req.status(200).json({
        success: true,
        message: "Collection updated succesfully",
        updatedCollection
    })
})

export const deleteCollection = asyncHandler(async (req,res) => {
    
    const {id: collectionId} = req.params

    let collectionToDelete = await Collection.findById(collectionId)
    

    if(!collectionToDelete){
        throw new CustomError("Collection not found", 404)
    }

    await collectionToDelete.remove()

    req.status(200).json({
        success: true,
        message: "Collection deleted succesfully",
        
    })
})

export const getAllCollection = asyncHandler(async (req,res) => {
    
    const collections = await Collection.find()
    
    if(!collections){
        throw new CustomError("No collection found", 404)
    }

    req.status(200).json({
        success: true,
        collections
        
    })
})