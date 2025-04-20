import { defineStore } from "pinia";
import { type Reactive, reactive } from "vue";

export class Employee {
	constructor(
		public name: string,
		public id: string,
		public tags: string[] = [],
	) {}
}

export const useStaffState = defineStore("staff", () => {
	const employees: Reactive<Map<string, Employee>> = reactive(new Map());
	// const tags: Reactive<Tag[]> = reactive([]);

	// TODO: Handle duplicate names
	function addEmployee(name: string) {
		const uuid = crypto.randomUUID();
		const employee = new Employee(name, uuid);
		employees.set(uuid, employee);

		return employee;
	}

	function removeEmployee(id: string) {
		employees.delete(id);
	}

	function renameEmployee(id: string, newName: string) {
		const employee = getEmployeeById(id);

		employee.name = newName;
	}

	function getEmployeeById(id: string): Employee {
		if (!employees.has(id)) throw new Error(`Employee with id:${id} doesn't exist!`);

		return employees.get(id)!;
	}

	function getEmployeeCount(): number {
		return employees.size;
	}

	return {
		addEmployee,
		removeEmployee,
		renameEmployee,
		getEmployeeCount,
	};
});

// export interface Tag {
// 	name: string;
// 	color: string;
// 	fontColor: string;
// }

// export class Staff {
// 	addEmployee(name: string, tags: string[] = []) {
// 		if (this.employees.some(e => e.name == name)) throw `Már létezik '${name}' dolgozó!`;

// 		const employee = new Employee(name, this.employees.length);
// 		this.employees.push(employee);
// 		for (const tag of tags) this.AddTag(name, tag);

// 		return employee;
// 	}
// 	Remove(name: string) {
// 		for (const tag of this.GetEmployee(name).tags) this.RemoveTag(name, tag);

// 		this.employees = this.employees.filter(x => x.name !== name);
// 	}
// 	Rename(newName: string, oldName: string) {
// 		const i = this.employees.findIndex(e => e.name == oldName);
// 		this.employees[i].name = newName;
// 	}
// 	AddTag(employeeName: string, tag: string) {
// 		if (!this.tags.some(x => x.name == tag)) {
// 			const color = tagColors[this.tags.length % tagColors.length];
// 			const fontColor = tagFontColors[this.tags.length % tagFontColors.length];
// 			this.tags.push({ name: tag, color, fontColor });
// 		}
// 		this.GetEmployee(employeeName).tags.push(tag);
// 	}
// 	RemoveTag(name: string, tag: string) {
// 		const employee = this.GetEmployee(name);
// 		employee.tags = employee.tags.filter(t => t !== tag);
// 		if (!this.employees.find(x => x.tags.includes(tag))) {
// 			this.tags = this.tags.filter(t => t.name !== tag);
// 			this.tags = this.tags.map((tag, i) => ({
// 				name: tag.name,
// 				color: tagColors[i % tagColors.length],
// 				fontColor: tagFontColors[i % tagFontColors.length],
// 			}));
// 		}
// 	}
// 	private GetEmployeeID(name: string): number {
// 		const id = this.employees.findIndex(e => e.name == name);
// 		if (id == -1) throw new Error(`Nem létezik '${name}' nevű dolgozó!`);
// 		return id;
// 	}
// 	GetEmployee(employee: string | number) {
// 		const id = typeof employee == "number" ? employee : this.GetEmployeeID(employee);
// 		if (id < 0 || id >= this.employees.length) throw new Error(`Nem létezik ${id}. dolgozó!`);
// 		return this.employees[id];
// 	}
// }
