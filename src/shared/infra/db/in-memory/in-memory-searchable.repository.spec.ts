import { SearchParamsInput, SearchParamsResult } from "../../../data";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { Entity } from "../../../entity";
import { ApplyFilterProps, InMemorySearchableRepository } from "./in-memory.repository";
import { faker } from "@faker-js/faker/locale/pt_BR";


describe("In memory repository unit tests", () => {

    type StubEntityProps = {
        entity_id?: Uuid;
        name: string;
        price: number;
    }

    type KeysStubEntity = keyof StubEntityProps;

    const stubEntity: StubEntityProps = {
        name: "test",
        price: 100
    };

    class StubEntity extends Entity {

        entity_id: Uuid;
        name: string;
        price: number;

        constructor(data: StubEntityProps) {
            super();
            this.entity_id = data.entity_id || new Uuid();
            this.name = data.name;
            this.price = data.price;

        }

        toJSON() {
            return {
                entity_id: this.entity_id.id,
                name: this.name,
                price: this.price
            };
        }

    }


    class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity, Uuid>{

        sortableFields: Set<KeysStubEntity> = new Set(["name"]);


        protected async applyFilter(props: ApplyFilterProps<StubEntity, string>) {
            if (!props.filter) {
                return props.items;
            }
            return props.items.filter((item) =>
            (item.name.toLowerCase().includes(props.filter.toLowerCase()) ||
                item.price.toString() === props.filter));
        }

        getEntity(): new (...args: any[]) => StubEntity {
            return StubEntity;
        }

    }

    let repository: StubInMemorySearchableRepository;

    beforeEach(() => {
        repository = new StubInMemorySearchableRepository();
    });

    describe("applyFilter method", () => {
        it("should not filter items when filter param is null", async () => {
            const items = [new StubEntity(stubEntity), new StubEntity(stubEntity)];
            const spyFilterItem = jest.spyOn(items, "filter");
            const result = await repository["applyFilter"]({ filter: null, items });

            expect(result).toStrictEqual(items);
            expect(spyFilterItem).not.toHaveBeenCalled();
        });

        it("should filter using a filter param", async () => {
            const stub1: StubEntityProps = {
                name: faker.person.firstName(),
                price: +faker.commerce.price({ dec: 0 })
            };
            const stub2: StubEntityProps = {
                name: faker.person.firstName(),
                price: stub1.price
            };
            const stub3: StubEntityProps = {
                name: stub1.name.toUpperCase(),
                price: +faker.commerce.price({ dec: 0 })
            };

            const items = [new StubEntity(stub1), new StubEntity(stub2), new StubEntity(stub3)];
            const spyFilterItem = jest.spyOn(items, "filter");

            let result = await repository["applyFilter"]({ filter: stub1.name, items });
            expect(result).toMatchObject([stub1, stub3]);
            expect(spyFilterItem).toHaveBeenCalledTimes(1);

            result = await repository["applyFilter"]({ filter: stub1.price.toString(), items });
            expect(result).toMatchObject([stub1, stub2]);
            expect(spyFilterItem).toHaveBeenCalledTimes(2);

            result = await repository["applyFilter"]({ filter: "no-filter", items });
            expect(result).toHaveLength(0);
            expect(spyFilterItem).toHaveBeenCalledTimes(3);

        });
    });
    describe("applySort method", () => {
        it("should not sort items when sortBy param is null", async () => {
            const items = [new StubEntity(stubEntity), new StubEntity({ ...stubEntity, price: stubEntity.price + 10000 })];

            let result = await repository["applySort"]({ sortBy: null, sortDirection: null, items });
            expect(result).toStrictEqual(items);

            result = await repository["applySort"]({ sortBy: "price", sortDirection: "desc", items });
            expect(result).toStrictEqual(items);
        });

        it("should sort items", async () => {
            const stub1: StubEntityProps = {
                name: "a",
                price: 1
            };
            const stub2: StubEntityProps = {
                name: "b",
                price: 2
            };
            const stub3: StubEntityProps = {
                name: "c",
                price: 3
            };

            const items = [new StubEntity(stub1), new StubEntity(stub2), new StubEntity(stub3)];

            let result = await repository["applySort"]({ sortBy: "name", sortDirection: "asc", items });
            expect(result).toStrictEqual([items[0], items[1], items[2]]);

            result = await repository["applySort"]({ sortBy: "name", sortDirection: "desc", items });
            expect(result).toStrictEqual([items[2], items[1], items[0]]);

        });
    });
    describe("applyPagination method", () => {
        it("should to paginate", async () => {
            const stub1: StubEntityProps = {
                name: "a",
                price: 1
            };
            const stub2: StubEntityProps = {
                name: "b",
                price: 2
            };
            const stub3: StubEntityProps = {
                name: "c",
                price: 3
            };

            const items = [new StubEntity(stub1), new StubEntity(stub2), new StubEntity(stub3)];

            let result = await repository["applyPagination"]({ page: 1, perPage: 1, items });
            expect(result).toStrictEqual([items[0]]);

            result = await repository["applyPagination"]({ page: 1, perPage: 2, items });
            expect(result).toStrictEqual([items[0], items[1]]);

            result = await repository["applyPagination"]({ page: 2, perPage: 1, items });
            expect(result).toStrictEqual([items[1]]);

            result = await repository["applyPagination"]({ page: 3, perPage: 1, items });
            expect(result).toStrictEqual([items[2]]);


            result = await repository["applyPagination"]({ page: 4, perPage: 1, items });
            expect(result).toHaveLength(0);
        });
    });
    describe("search method", () => {
        it("should apply only paginate when other params are null", async () => {
            const entity = new StubEntity(stubEntity);
            const items = Array(16).fill(entity);

            repository.items = items;

            const result = await repository.search(new SearchParamsInput());

            expect(result).toStrictEqual(new SearchParamsResult({
                items: items.slice(0, 15),
                total: items.length,
                current_page: 1,
                per_page: 15
            }));
        });

        it("should apply paginate and filter", async () => {
            const items = [
                new StubEntity({ name: "test", price: 5 }),
                new StubEntity({ name: "a", price: 5 }),
                new StubEntity({ name: "TEST", price: 5 }),
                new StubEntity({ name: "TeSt", price: 5 }),
            ];

            repository.items = items;

            let result = await repository.search(
                new SearchParamsInput({
                    page: 1,
                    per_page: 2,
                    filter: "TEST"
                })
            );

            expect(result).toStrictEqual(new SearchParamsResult({
                items: [items[0], items[2]],
                total: 3,
                current_page: 1,
                per_page: 2
            }));

            result = await repository.search(
                new SearchParamsInput({
                    page: 2,
                    per_page: 2,
                    filter: "TEST"
                })
            );

            expect(result).toStrictEqual(new SearchParamsResult({
                items: [items[3]],
                total: 3,
                current_page: 2,
                per_page: 2
            }));
        });

        it("should apply paginate and sort", async () => {
            const items = [
                new StubEntity({ name: "c", price: 5 }),
                new StubEntity({ name: "b", price: 5 }),
                new StubEntity({ name: "a", price: 5 }),
            ];

            repository.items = items;

            let result = await repository.search(
                new SearchParamsInput({
                    page: 1,
                    per_page: 2,
                    sort_by: "name",
                })
            );

            expect(result).toStrictEqual(new SearchParamsResult({
                items: [items[2], items[1]],
                total: 3,
                current_page: 1,
                per_page: 2
            }));

            result = await repository.search(
                new SearchParamsInput({
                    page: 2,
                    per_page: 2,
                    sort_by: "name",
                })
            );

            expect(result).toStrictEqual(new SearchParamsResult({
                items: [items[0]],
                total: 3,
                current_page: 2,
                per_page: 2
            }));
        });

        it("should apply paginate, filter and sort", async () => {
            const items = [
                new StubEntity({ name: "c", price: 5 }),
                new StubEntity({ name: "b", price: 5 }),
                new StubEntity({ name: "a", price: 5 }),
            ];

            repository.items = items;

            let result = await repository.search(
                new SearchParamsInput({
                    page: 1,
                    per_page: 2,
                    sort_by: "name",
                    filter: "a"
                })
            );

            expect(result).toStrictEqual(new SearchParamsResult({
                items: [items[2]],
                total: 1,
                current_page: 1,
                per_page: 2
            }));

            result = await repository.search(
                new SearchParamsInput({
                    page: 2,
                    per_page: 2,
                    sort_by: "name",
                    filter: "a"
                })
            );

            expect(result).toStrictEqual(new SearchParamsResult({
                items: [],
                total: 1,
                current_page: 2,
                per_page: 2
            }));

        });
    });

});