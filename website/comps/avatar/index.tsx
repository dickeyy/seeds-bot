import Image from "next/image";

export default function Avatar(props:any) {
    return (
        <div className="avatar w-full">
            <div className={`w-full mask mask-circle ` + props.className}>
                <Image src={props.picture} alt="User Avatar" width={40} height={40} />
            </div>
        </div>
    )
}