import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied){
            if(decision.reason.isRateLimit){
                return res.status(429).json({ message: "Too many requests. Please try again later." });
            } else if(decision.reason.isBot){
                return res.status(403).json({ message: "Access denied. Bot traffic is not allowed." });
            }else{
                return res.status(403).json({ message: "Access denied." });
            }
        }
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({ message: "Access denied. Spoofed bots are not allowed." });
        }
        next();
    } catch (error) {
        console.log("Arcjet protection error:", error);
        next();
    }
};