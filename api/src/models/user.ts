import pool from "../utils/database";
import bcrypt from "bcrypt";

const getAllModel = async () => {
    const result = await pool.query(`
        SELECT  id,
                rut,
                name, 
                paternalLastName, 
                maternalLastName, 
                email, 
                phone
        FROM public.user
        WHERE isActive = true`);
    return result.rows;
}

const getByIdModel = async (id: string) => {
    const result = await pool.query(`
        SELECT  rut,
                name, 
                paternalLastName, 
                maternalLastName, 
                email, 
                phone
        FROM public.user 
        WHERE id = $1`, [id]);
    return result.rows[0];
}

const createModel = async (rut: string, name: string, paternalLastName: string, maternalLastName: string, email: string, phone: string, urlPhoto: string, grade: string) => {
    const result = await pool.query(`
        INSERT INTO public.user (
            rut, 
            name, 
            paternalLastName, 
            maternalLastName, 
            email, 
            phone,
            urlPhoto,
            grade
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`, [rut, name, paternalLastName, maternalLastName, email, phone, urlPhoto, grade]);
    return result.rows[0];
}

const updateModel = async (id: string, rut: string, name: string, paternalLastName: string, maternalLastName: string, email: string, phone: string, isActive: string) => {
    const result = await pool.query(`
        UPDATE public.user 
        SET rut = $2, 
            name = $3,
            paternalLastName = $4,
            maternalLastName = $5,
            email = $6,
            phone = $7,
            isActive = $8 
        WHERE id = $1 
        RETURNING *`, [id, rut, name, paternalLastName, maternalLastName, email, phone, isActive]);
    return result.rows[0];
}

const deleteModel = async (id: string) => {
    const result = await pool.query(`
    UPDATE public.user 
    SET  isACtive = false  
    WHERE id = $1`, [id]);
    return result;
}

const validateModel = async (email: string, password: string) => {
    const result = await pool.query(`
        SELECT  rut,
                name, 
                paternalLastName, 
                maternalLastName, 
                email, 
                phone,
                urlphoto,
                grade,
                hash
        FROM public.user 
        WHERE email = $1`, [email]);
    const { rut,
            name, 
            paternalLastName, 
            maternalLastName, 
            phone,
            urlphoto,
            grade,
            hash} = result.rows[0];  
    const isValid = await bcrypt.compare(password, hash);
    return {rut,
            name, 
            paternalLastName, 
            maternalLastName, 
            phone,
            urlphoto,
            grade,
            isValid};
} 

const assaignPasswordModel = async (id: string, password: string) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds)
    const result = await pool.query(`
    UPDATE public.user 
    SET  hash = $2  
    WHERE id = $1`, [id, hash]);
    return result;
}

export {getAllModel, getByIdModel, createModel, updateModel, deleteModel, validateModel, assaignPasswordModel};