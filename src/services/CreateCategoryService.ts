// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
}
class CreateCategoryService {
  public async execute({ title }: RequestDTO): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const categoryTitle = title;
    const category = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });
    if (category) {
      return category;
    }
    const newCategory = categoryRepository.create({ title });
    await categoryRepository.save(newCategory);
    return newCategory;
  }
}

export default CreateCategoryService;
