import {
  CreateCategoryOutput,
  UpdateCategoryOutput,
  GetCategoryInput,
  GetCategoryOutput,
  ListCategoryOutput
} from 'micro-videos-core/category/application';
import { SearchParams } from 'micro-videos-core/dist/@seedwork/domain/repository/repository-contract';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController Unit tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const input: CreateCategoryDto = {
      name: "Test",
      description: "Test",
      is_active: true
    }

    const dateCreated = new Date();
    const output: CreateCategoryOutput = {
      id: "1",
      created_at: dateCreated,
      description: input.description,
      is_active: input.is_active,
      name: input.name
    }


    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(output)
    }

    //@ts-expect-error
    controller["createUseCase"] = mockCreateUseCase

    const categoryCreated = await controller.create(input)

    expect(mockCreateUseCase.execute).toBeCalledWith(input)
    expect(categoryCreated).toEqual(output)
  });

  it('should updates a category', async () => {

    const expectedOutput: UpdateCategoryOutput = {
      id: "93eeb0a0-8b9d-4b0a-9c1a-1c8b9dcb0a9d",
      name: "Test",
      description: "Test",
      created_at: new Date(),
      is_active: true
    }

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput)
    }

    //@ts-expect-error
    controller["updateUseCase"] = mockUpdateUseCase

    const input: UpdateCategoryDto = {
      name: "Test",
      description: "Test",
      is_active: true
    }

    const categoryUpdated = await controller.update("93eeb0a0-8b9d-4b0a-9c1a-1c8b9dcb0a9d", input)

    expect(mockUpdateUseCase.execute).toBeCalledWith({ id: expectedOutput.id, ...input })
    expect(categoryUpdated).toStrictEqual(expectedOutput)
  });

  it('should deletes a category', async () => {

    const id = "93eeb0a0-8b9d-4b0a-9c1a-1c8b9dcb0a9d"
    const expectedOutput = undefined

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput))
    }

    //@ts-expect-error
    controller["deleteUseCase"] = mockDeleteUseCase

    const categoryDeleted = await controller.remove(id)

    expect(controller.remove(id)).toBeInstanceOf(Promise)
    expect(mockDeleteUseCase.execute).toBeCalledWith({ id })
    expect(categoryDeleted).toStrictEqual(expectedOutput)

  });

  it('should gets a category', async () => {
    const input: GetCategoryInput = {
      id: "93eeb0a0-8b9d-4b0a-9c1a-1c8b9dcb0a9d"
    }

    const expectedOutput: GetCategoryOutput = {
      id: input.id,
      name: "Test",
      description: "Test",
      created_at: new Date(),
      is_active: true
    }
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput))
    }

    //@ts-expect-error
    controller["getUseCase"] = mockGetUseCase
    const category = await controller.findOne(input.id)

    expect(mockGetUseCase.execute).toBeCalledWith(input)
    expect(category).toStrictEqual(expectedOutput)
  });

  it('should list categories', async () => {
      const expectedOutput: ListCategoryOutput = {
        items:[
          {
            id: "93eeb0a0-8b9d-4b0a-9c1a-1c8b9dcb0a9d",
            name: "Test",
            description: "Test",
            created_at: new Date(),
            is_active: true
          }
        ],
        total: 1,
        current_page: 1,
        per_page: 1,
        last_page: 1
      }

      const mockListUseCase = {
        execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput))
      }

      //@ts-expect-error
      controller["listUseCase"] = mockListUseCase

      const searchParams = {
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "Test"
      }
      const categories = await controller.search(searchParams as SearchParams)

      expect(mockListUseCase.execute).toBeCalledWith(searchParams)
      expect(categories).toStrictEqual(expectedOutput)
  });

});
