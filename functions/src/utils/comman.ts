interface CreatedBy {
  id: string;
  createdAt?: number;
}

interface UpdatedBy {
  id: string;
  updatedAt?: number;
}

const getCreatedBy = (userId: string, includeTimestamp = true) => {
  const createdBy: CreatedBy = {id: userId};
  if (includeTimestamp) {
    createdBy["createdAt"] = Date.now();
  }
  return createdBy;
};

const getUpdatedBy = (userId: string, includeTimestamp = true) => {
  const updatedBy: UpdatedBy = {id: userId};
  if (includeTimestamp) {
    updatedBy["updatedAt"] = Date.now();
  }
  return updatedBy;
};

export {
  getCreatedBy,
  getUpdatedBy,
};
