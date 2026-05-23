from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerialzer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','password','phone']
        extra_kwargs = {
            'password':{'write_only':True}
        }

    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["is_staff"] = user.is_staff
        token["username"] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "is_staff": self.user.is_staff,
        }

        return data