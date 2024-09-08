import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createUser, findUser } from '../models';
import { hash } from 'bcrypt';
import { ROLES } from './constants';
import { Resend } from 'resend';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import path from 'path';
import { FirebaseNotificationParams } from './interfaces';

require('dotenv').config();

const serviceAccount = path.resolve('./traderisk-463ed-firebase-adminsdk-g2ow6-9cdef4d862.json');

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();

export const sendFirebaseNotification = async ({ title, body, tokens, data }: FirebaseNotificationParams) => {
  const message = {
    notification: { title, body },
    tokens,
    webpush: {
      notification: { data },
    },
  };

  console.log({ message });

  try {
    const response = await firebaseAdmin.messaging().sendEachForMulticast(message);
    console.log('successCount >>>> ', response?.successCount);
    console.log('failureCount >>>> ', response?.failureCount);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// generate response with status code
export const generateResponse = (data: any, message: string, res: Response, code = 200) => {
  return res.status(code).json({
    statusCode: code,
    message,
    data,
  });
}

// parse body to object or json (if body is string)
export const parseBody = (body: any) => {
  if (typeof body === 'string') {
    return JSON.parse(body);
  }

  return body;
}

// pagination with mongoose paginate library
export const getMongoosePaginatedData = async (
  {
    model, page = 1, limit = 10, query = {}, populate = '', select = '-password', sort = { createdAt: -1 },
  }:
    {
      model: any,
      page?: number,
      limit?: number,
      query?: Record<string, any>,
      populate?: any,
      select?: string,
      sort?: Record<string, any>,
    }) => {
  const options = {
    select,
    sort,
    populate,
    lean: true,
    page,
    limit,
    customLabels: {
      totalDocs: 'totalItems',
      docs: 'data',
      limit: 'perPage',
      page: 'currentPage',
      meta: 'pagination',
    },
  };

  const { data, pagination } = await model.paginate(query, options);
  delete pagination?.pagingCounter;

  return { data, pagination };
}

// aggregate pagination with mongoose paginate library
export const getMongooseAggregatePaginatedData = async ({ model, page = 1, limit = 10, query = [] }: { model: any, page?: number, limit?: number, query?: any[] }) => {
  const options = {
    page,
    limit,
    customLabels: {
      totalDocs: 'totalItems',
      docs: 'data',
      limit: 'perPage',
      page: 'currentPage',
      meta: 'pagination',
    },
  };
  const myAggregate = model.aggregate(query);
  const { data, pagination } = await model.aggregatePaginate(myAggregate, options);

  delete pagination?.pagingCounter;

  return { data, pagination };
}

export const asyncHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// create default admin
export const createDefaultAdmin = async () => {
  try {
    const userExist = await findUser({ email: process.env.ADMIN_DEFAULT_EMAIL, role: ROLES.ADMIN });
    if (userExist) {
      console.log('admin exists ->', userExist.email);
      return
    };

    console.log('admin not exist');
    const password = await hash(process.env.ADMIN_DEFAULT_PASSWORD as string, 10);

    // create default admin
    await createUser({
      name: 'Admin',
      email: process.env.ADMIN_DEFAULT_EMAIL,
      password,
      role: ROLES.ADMIN
    });

    console.log('Admin default created successfully');
  } catch (error) {
    console.log('error - create default admin -> ', error);
  }
};

export function generatePassword(): string {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export const sendEmail = async ({ subject, to, html }: { subject: string, to: string, html: string }) => {
  const resend = new Resend('re_PfY2RMhd_HcEgmT5L2qW5hT2HwzwqzM6G');

  const { data, error } = await resend.emails.send({
    from: 'yameenyousuf2016@gmail.com',
    to,
    subject,
    html,
  });

  if (error) return error;
  return data;
}

export const portsList = [
  {
    "country": "Uae",
    "city": "Dubai",
    "port_name": "Port of Jebel Ali"
  },
  {
    "country": "Uae",
    "city": "Fujairah",
    "port_name": "Port of Fujairah"
  },
  {
    "country": "Uae",
    "city": "Ras Al Khaimah",
    "port_name": "Port of Ras Al Khaimah"
  },
  {
    "country": "Uae",
    "city": "Dubai",
    "port_name": "Mina Rashid Port"
  },
  {
    "country": "Uae",
    "city": "Sharjah",
    "port_name": "Mina Khalid Port"
  },
  {
    "country": "Saudi Arabia",
    "city": "Jubail",
    "port_name": "Jubail"
  },
  {
    "country": "Saudi Arabia",
    "city": "Yanbu",
    "port_name": "Yanbu Commercial"
  },
  {
    "country": "Saudi Arabia",
    "city": "Jeddah",
    "port_name": "Jeddah"
  },
  {
    "country": "Saudi Arabia",
    "city": "Dammam",
    "port_name": "Dammam"
  },
  {
    "country": "Pakistan",
    "city": "Gwadar",
    "port_name": "Gwadar"
  },
  {
    "country": "Pakistan",
    "city": "Karachi",
    "port_name": "Karachi"
  },
  {
    "country": "Pakistan",
    "city": "Muhammad bin qasim",
    "port_name": "Muhammad bin qasim"
  },
  {
    "country": "Pakistan",
    "city": "Port of ormara",
    "port_name": "Port of ormara"
  },
  {
    "country": "Oman",
    "city": "Khasab",
    "port_name": "Khasab."
  },
  {
    "country": "Oman",
    "city": "Muscat",
    "port_name": "Muscat"
  },
  {
    "country": "Oman",
    "city": "Mina Qaboos",
    "port_name": "Mina Qaboos"
  },
  {
    "country": "Oman",
    "city": "Sohar",
    "port_name": "Sohar"
  },
  {
    "country": "Oman",
    "city": "Salalah",
    "port_name": "Salalah"
  },
  {
    "country": "Bahrain",
    "city": "Khalifa Bin Salman Port",
    "port_name": "Khalifa Bin Salman Port"
  },
  {
    "country": "Bahrain",
    "city": "Muharraq",
    "port_name": "Muharraq Fisherman Port"
  },
  {
    "country": "Bahrain",
    "city": "Budaiya",
    "port_name": "Budaiya Fisherman Port"
  },
  {
    "country": "Bahrain",
    "city": "Hidd",
    "port_name": "Hidd Fisherman Port"
  },
  {
    "country": "Qatar",
    "city": "Doha",
    "port_name": "Doha"
  },
  {
    "country": "Qatar",
    "city": "Al Rayyan",
    "port_name": "Al Rayyan Marine Terminal"
  },
  {
    "country": "Qatar",
    "city": "Mesaieed",
    "port_name": "Mesaieed"
  },
  {
    "country": "Qatar",
    "city": "Ras Laffan",
    "port_name": "Ras Laffan"
  },
  {
    "country": "Qatar",
    "city": "Hamad",
    "port_name": "Hamad"
  },
  {
    "country": "Qatar",
    "city": "Umm Said",
    "port_name": "Umm Said"
  },
  {
    "country": "Uae",
    "city": "Mina Zayed",
    "port_name": "Port of Mina Zayed"
  },
  {
    "country": "Saudi Arabia",
    "city": "Jizan",
    "port_name": "Jizan"
  },
  {
    "country": "Saudi Arabia",
    "city": "Jiwani",
    "port_name": "Jiwani"
  },
  {
    "country": "Pakistan",
    "city": "Keti Bandar",
    "port_name": "Keti Bandar"
  },
  {
    "country": "Oman",
    "city": "Qalhat",
    "port_name": "Qalhat"
  },
  {
    "country": "Bahrain",
    "city": "Qalali",
    "port_name": "Qalali Fisherman Port"
  },
  {
    "country": "Bahrain",
    "city": "Al Dur Jetty",
    "port_name": "Al Dur Jetty Fisherman Posr"
  }
]

export const getMongoId = (id?: string) => {
  return new mongoose.Types.ObjectId(id as string);
}