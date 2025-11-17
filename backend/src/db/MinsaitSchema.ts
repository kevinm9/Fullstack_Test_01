import Joi from "joi";

export const MinsaitSchema = Joi.object({
    claveInicio: Joi.string().required(),
    claveFin: Joi.string().required(),
    avanzar: Joi.boolean().required(),
    retroceder: Joi.boolean().required(),
    canal: Joi.string().required(),
    entidad: Joi.string().required(),
    idioma: Joi.string().required(),
    pantPagina: Joi.string().required(),
    SecurityHash: Joi.string().required(),
    centalta: Joi.string().required(),
    clamon: Joi.number().required(),
    codent: Joi.string().required(),
    cuenta: Joi.string().required(),
    fecfac: Joi.number().required(),
    impfac: Joi.number().required(),
    linref: Joi.string().required(),
    refdocpag: Joi.string().required(),
    tipdocpag: Joi.string().required(),
    tipofac: Joi.number().required(),
    tipolin: Joi.string().required()
})