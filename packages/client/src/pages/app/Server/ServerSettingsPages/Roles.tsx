import { useEffect, useState } from "react";
import AxiosInstance from "../../../../lib/AxiosInstance";
import { useParams } from "react-router-dom";
import { ServerController } from "../../../../lib/ServerController";
import { useModal } from "../../../../lib/context/ModalContext";

interface RoleButtonProps {
	name: string;
	hexColor: string;
	id: string;
}

export const RoleButton = ({ name, hexColor, id }: RoleButtonProps) => {
	const colorClass = `bg-[#${hexColor}]`;

	return (
		<div className="w-full box-border bg-background-secondary hover:bg-background-secondary-hover p-2 rounded-2xl flex items-center gap-2">
			<span className={`w-6 h-6 ${colorClass} rounded-full border-2 ${colorClass}`}></span>
			<h1 className="text-md font-bold cursor-pointer">{name}</h1>
		</div>
	);
}


export const Roles = () => {
	const [roles, setRoles] = useState<any[]>([]);
	const { serverId } = useParams();
	const { showModal } = useModal();

	useEffect(() => {
		const fetchRoles = async () => {
			const data = await ServerController.getRoles(serverId!);
			console.log(data);
			setRoles(data.roles);
		};
		fetchRoles();
	}, []);

	const createRoleModal = async () => {
		let name = '';
		let hexColor = '';
		showModal(<>
			<h1 className="text-2xl font-bold mb-2">Create Role</h1>
			<p className="text-gray-500 mb-4 text-md">Create a role for this server.</p>
			<div className="relative">
				<p className="text-gray-500 text-sm mb-4">Name</p>
				<input
					type="text"
					className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5 pr-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
					placeholder="My cool role"
					value={name}
					onChange={(e) => (name = e.target.value)}
				/>

				<p className="text-gray-500 text-sm mb-4">Hex Color</p>
				<input
					type="color"
					className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5 pr-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
					value={hexColor}
					onChange={(e) => (hexColor = e.target.value)}
				/>

			</div>
		</>, () => {
			console.log(name, hexColor);
		})
	}


	return (
		<div className="w-full h-full box-border bg-background-secondary p-4 rounded-2xl flex-row flex gap-4">
			<div className="w-[15rem] bg-background-primary h-full flex flex-col rounded-2xl p-4 box-border">
				<div className="flex flex-row gap-2 items-center align-center justify-between mb-2">
					<h1 className="text-2xl mb-2 font-bold">Roles</h1>
					<button className="text-slate-400 hover:text-slate-300 text-4xl font-bold" onClick={() => createRoleModal()}>+</button>
				</div>
				<hr />
				{roles && (
					<div className="flex flex-col gap-2 mt-4 overflow-y-auto h-full">
						{roles.map((role) => (
							<RoleButton key={role.id} name={role.name} hexColor={role.hexColor} id={role.id} />
						))}
					</div>
				)}
			</div>
			<div className="w-1/2 h-full flex flex-col rounded-2xl p-4 box-border">
				<div className='w-full bg-background-primary rounded-2xl p-4'>
					<h1 className="text-md text-slate-400 mb-2 font-bold">ROLE NAME</h1>
					<input className="h-10 bg-background-primary border border-slate-300 rounded-md text-slate-400" />
				</div>
			</div>
		</div>
	);
}
