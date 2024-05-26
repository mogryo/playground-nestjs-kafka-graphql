import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './post';

/**
 * Define logic for CRUD operations for Post entity
 */
@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name)
        private model: Model<Post>,
    ) {}

    async getTotalCount(filters: Record<string, any>): Promise<number> {
        const totalCount = await this.model.countDocuments(filters).exec();
        return totalCount;
    }

    async findOneById(id: string): Promise<Post | null> {
        if (id) {
            return this.model.findById(id).exec();
        }
        return null;
    }

    async findAll(
        pageNumber: number,
        pageSize: number,
        filters: Record<string, any>,
    ): Promise<Post[] | null> {
        const skipCount = (pageNumber - 1) * pageSize;

        return this.model
            .find()
            .where(filters)
            .skip(skipCount)
            .limit(pageSize)
            .exec();
    }

    async create(input: Partial<Post>): Promise<Post> {
        const created = new this.model(input);
        return created.save();
    }

    async update(id: string, input: Partial<Post>): Promise<Post | null> {
        const existing = await this.model.findById(id).exec();

        if (!existing) {
            // Handle the case where the input with the given ID is not found
            return null;
        }

        return this.model.findByIdAndUpdate(id, input, { new: true }).exec();
    }

    async delete(id: string, softDelete = false): Promise<Post | null> {
        if (softDelete) {
            // Soft delete by marking as deleted (assuming 'deletedAt' field exists in the schema)
            return this.model
                .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
                .exec();
        } else {
            // Hard delete
            return this.model.findByIdAndDelete(id).exec();
        }
    }
}
