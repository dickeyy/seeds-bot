export default function Command({ command, key }: { command: any, key: number }) {
    return (
        <div className="collapse collapse-plus bg-base-200 hover:bg-base-200/70 transition-all ease-in-out duration-150">
            <input type="radio" name="my-accordion-1" /> 
            <div className="collapse-title sm:text-xl">
                <h3 className="text-2xl font-semibold">{command.name}</h3>
                <p className="text-zinc-500 sm:text-lg text-md">{command.short_description}</p>
            </div>
            <div className="collapse-content"> 
            <p className="text-zinc-500 text-lg mb-5">
                Required Permission: {command.permission}
            </p>
            <div className="bg-neutral sm:p-6 p-2 flex-wrap flex-row rounded-xl flex w-full ">
                <pre>
                    <code className="flex flex-wrap">
                        /{command.name} 
                        {command.parameters.required.map((param: any, index: number) => {
                            return (
                                <span key={index} className="text-green-400"> {"<"}{param}{">"}</span> 
                            )
                        })}
                        {command.parameters.optional.map((param: any, index: number) => {
                            return (
                                <span key={index} className="text-pink-400"> {"["}{param}{"]"}</span> 
                            )
                        })}

                    </code>
                </pre>
            </div>

            <div className="text-zinc-200 text-lg mt-4">
                {command.long_description}
            </div>

            </div>
        </div>
    )
}